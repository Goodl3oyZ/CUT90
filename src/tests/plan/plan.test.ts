import { describe, expect, it } from 'vitest';
import {
  addDays,
  calculateBmr,
  calculatePlan,
  calculatePlanSummary,
  calculateStatus,
  calculateTdee,
  calculateWarnings,
  diffDays,
  getDateForDay,
  getDayForDate,
  recalibrateProfile,
  UserProfile,
} from '../../lib/plan';

describe('Cut 90 Plan Calculation Engine', () => {
  const sampleProfile: UserProfile = {
    sex: 'male',
    age: 30,
    heightCm: 175,
    startWeightKg: 79.3,
    goalWeightKg: 69.5,
    activityLevel: 'moderately', // 1.55
    startDate: '2026-10-01',
    proteinGPerKg: 2.1,
    fatGPerKg: 0.8,
  };

  it('calculates BMR and TDEE correctly using Mifflin-St Jeor', () => {
    // 10 * 79.3 + 6.25 * 175 - 5 * 30 + 5 = 793 + 1093.75 - 150 + 5 = 1741.75
    const bmr = calculateBmr('male', 30, 175, 79.3);
    expect(bmr).toBeCloseTo(1741.75, 2);

    // 1741.75 * 1.55 = 2699.7125
    const tdee = calculateTdee(bmr, 'moderately');
    expect(tdee).toBeCloseTo(2699.71, 1);
  });

  it('matches prompt benchmark: male 30y, 175cm, 79.3kg -> goal 69.5kg', () => {
    const plan = calculatePlan(sampleProfile);

    expect(plan.length).toBe(90);

    // Day 1 targets: ~1851 kcal
    const day1 = plan[0];
    expect(day1.day).toBe(1);
    expect(day1.date).toBe('2026-10-01');
    expect(day1.expectedWeightKg).toBe(79.3);
    expect(day1.targetKcal).toBeGreaterThanOrEqual(1845);
    expect(day1.targetKcal).toBeLessThanOrEqual(1865);

    // Day 90 targets: ~1700 kcal, expected weight 69.5 kg
    const day90 = plan[89];
    expect(day90.day).toBe(90);
    expect(day90.targetKcal).toBeGreaterThanOrEqual(1690);
    expect(day90.targetKcal).toBeLessThanOrEqual(1710);
    expect(day90.expectedWeightKg).toBeCloseTo(69.5, 1);
  });

  it('handles recalibration properly: days before keep original, days from recal onward recompute', () => {
    const recalProfile = recalibrateProfile(sampleProfile, 10, [
      { day: 7, weightKg: 78.5 },
      { day: 8, weightKg: 78.4 },
      { day: 9, weightKg: 78.2 },
      { day: 10, weightKg: 78.0 },
    ]);

    expect(recalProfile.recalDay).toBe(10);
    expect(recalProfile.recalWeightKg).toBeCloseTo(78.275, 2);

    const basePlan = calculatePlan(sampleProfile);
    const recalPlan = calculatePlan(recalProfile);

    // Days 1..9 should match original base plan
    for (let d = 1; d <= 9; d++) {
      expect(recalPlan[d - 1].expectedWeightKg).toBe(basePlan[d - 1].expectedWeightKg);
      expect(recalPlan[d - 1].targetKcal).toBe(basePlan[d - 1].targetKcal);
    }

    // Day 10 onward uses recalibrated weight
    expect(recalPlan[9].expectedWeightKg).toBeCloseTo(78.28, 1);
    expect(recalPlan[89].expectedWeightKg).toBeCloseTo(69.5, 1);
  });

  it('enforces calorie floors for safety (male min 1500 / female min 1200)', () => {
    // Extreme goal: try losing 30 kg in 90 days
    const extremeProfile: UserProfile = {
      ...sampleProfile,
      sex: 'female',
      startWeightKg: 65,
      goalWeightKg: 40,
      activityLevel: 'sedentary',
    };

    const plan = calculatePlan(extremeProfile);
    const hasFloorHit = plan.some((d) => d.isFloorHit);
    expect(hasFloorHit).toBe(true);

    // Min calorie floor for female is max(BMR, 1200)
    for (const d of plan) {
      expect(d.targetKcal).toBeGreaterThanOrEqual(1200);
    }

    const warnings = calculateWarnings(extremeProfile, plan);
    expect(warnings.isFloorHit).toBe(true);
  });

  it('calculates 7-day average status pills (ahead, on_track, behind)', () => {
    const plan = calculatePlan(sampleProfile);

    // Ahead test: logged weights significantly lower than expected (< -0.3 kg)
    const aheadLogs = [
      { day: 1, weightKg: 79.3 },
      { day: 2, weightKg: 78.8 },
      { day: 3, weightKg: 78.2 },
      { day: 4, weightKg: 77.9 },
    ];
    const aheadStatus = calculateStatus(aheadLogs, plan);
    expect(aheadStatus.status).toBe('ahead');
    expect(aheadStatus.diffKg).toBeLessThan(-0.3);

    // Behind test: logged weights higher than expected (> 0.4 kg)
    const behindLogs = [
      { day: 1, weightKg: 79.3 },
      { day: 2, weightKg: 79.8 },
      { day: 3, weightKg: 80.1 },
    ];
    const behindStatus = calculateStatus(behindLogs, plan);
    expect(behindStatus.status).toBe('behind');
    expect(behindStatus.diffKg).toBeGreaterThan(0.4);

    // On track test: close to expected
    const onTrackLogs = [
      { day: 1, weightKg: 79.3 },
      { day: 2, weightKg: 79.2 },
    ];
    const onTrackStatus = calculateStatus(onTrackLogs, plan);
    expect(onTrackStatus.status).toBe('on_track');
  });

  it('handles timezone-safe date calculations', () => {
    const start = '2026-10-01';
    expect(addDays(start, 0)).toBe('2026-10-01');
    expect(addDays(start, 5)).toBe('2026-10-06');
    expect(addDays(start, 89)).toBe('2026-12-29');

    expect(diffDays('2026-10-01', '2026-10-10')).toBe(9);
    expect(getDateForDay(start, 1)).toBe('2026-10-01');
    expect(getDateForDay(start, 90)).toBe('2026-12-29');

    expect(getDayForDate(start, '2026-10-01')).toBe(1);
    expect(getDayForDate(start, '2026-10-10')).toBe(10);
    expect(getDayForDate(start, '2027-01-01')).toBeNull();
  });

  it('handles maintenance edge case when goal >= start weight', () => {
    const maintProfile: UserProfile = {
      ...sampleProfile,
      startWeightKg: 75.0,
      goalWeightKg: 75.0,
    };

    const plan = calculatePlan(maintProfile);
    expect(plan[0].expectedWeightKg).toBe(75.0);
    expect(plan[89].expectedWeightKg).toBeCloseTo(75.0, 1);

    const summary = calculatePlanSummary(maintProfile, plan);
    expect(summary.avgDailyDeficit).toBeLessThanOrEqual(5);
  });
});
