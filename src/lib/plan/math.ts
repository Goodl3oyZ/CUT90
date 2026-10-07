import {
  ActivityLevel,
  PlanDay,
  PlanSummary,
  Sex,
  UserProfile,
} from './types';
import { getDateForDay } from './date';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly: 1.375,
  moderately: 1.55,
  very: 1.725,
  extremely: 1.9,
};

export function getActivityMultiplier(activity: ActivityLevel): number {
  return ACTIVITY_MULTIPLIERS[activity] ?? 1.2;
}

export function calculateBmr(
  sex: Sex,
  age: number,
  heightCm: number,
  weightKg: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function calculateTdee(bmr: number, activity: ActivityLevel): number {
  return bmr * getActivityMultiplier(activity);
}

export function calculateCalorieFloor(sex: Sex, bmr: number): number {
  const absoluteMin = sex === 'male' ? 1500 : 1200;
  return Math.max(bmr, absoluteMin);
}

/**
 * Calculates the full 90-day plan day-by-day.
 * Supports single segment or recalibrated segment from recalDay onward.
 */
export function calculatePlan(profile: UserProfile): PlanDay[] {
  const TOTAL_DAYS = 90;
  const days: PlanDay[] = [];

  const proteinGPerKg = profile.proteinGPerKg ?? 2.1;
  const fatGPerKg = profile.fatGPerKg ?? 0.8;

  const hasRecal =
    typeof profile.recalDay === 'number' &&
    profile.recalDay > 1 &&
    profile.recalDay <= TOTAL_DAYS &&
    typeof profile.recalWeightKg === 'number' &&
    profile.recalWeightKg > 0;

  // Segment 1 setup (days 1 to recalDay - 1, or 1 to 90)
  const segment1End = hasRecal ? profile.recalDay! - 1 : TOTAL_DAYS;
  const n1 = Math.max(1, TOTAL_DAYS - 1); // 89 days interval from day 1 to day 90
  const totalDrop1 = Math.max(0, profile.startWeightKg - profile.goalWeightKg);
  const dailyDeficit1 = (totalDrop1 * 7700) / n1;

  let currentWeight = profile.startWeightKg;

  // Loop through days 1 to segment1End
  for (let d = 1; d <= segment1End; d++) {
    const bmr = calculateBmr(profile.sex, profile.age, profile.heightCm, currentWeight);
    const tdee = calculateTdee(bmr, profile.activityLevel);
    const floor = calculateCalorieFloor(profile.sex, bmr);

    const rawTargetKcal = tdee - dailyDeficit1;
    const isFloorHit = rawTargetKcal < floor;
    const targetKcalBeforeMacros = Math.max(rawTargetKcal, floor);

    const targetProteinG = Math.round(proteinGPerKg * currentWeight);
    const targetFatG = Math.round(fatGPerKg * currentWeight);
    const targetCarbG = Math.max(
      0,
      Math.round((targetKcalBeforeMacros - 4 * targetProteinG - 9 * targetFatG) / 4)
    );
    const actualTargetKcal = 4 * targetProteinG + 4 * targetCarbG + 9 * targetFatG;

    days.push({
      day: d,
      date: getDateForDay(profile.startDate, d),
      expectedWeightKg: Math.round(currentWeight * 100) / 100,
      targetKcal: actualTargetKcal,
      targetProteinG,
      targetCarbG,
      targetFatG,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      isFloorHit,
    });

    // Advance expected weight to next day
    const actualBurn = tdee - actualTargetKcal;
    const weightDrop = actualBurn / 7700;
    currentWeight = currentWeight - weightDrop;
  }

  // Segment 2 setup (recalDay to 90) if recalibration exists
  if (hasRecal) {
    const recalStartDay = profile.recalDay!;
    currentWeight = profile.recalWeightKg!;
    const n2 = Math.max(1, TOTAL_DAYS - recalStartDay);
    const totalDrop2 = Math.max(0, currentWeight - profile.goalWeightKg);
    const dailyDeficit2 = n2 > 0 ? (totalDrop2 * 7700) / n2 : 0;

    for (let d = recalStartDay; d <= TOTAL_DAYS; d++) {
      const bmr = calculateBmr(profile.sex, profile.age, profile.heightCm, currentWeight);
      const tdee = calculateTdee(bmr, profile.activityLevel);
      const floor = calculateCalorieFloor(profile.sex, bmr);

      const rawTargetKcal = tdee - dailyDeficit2;
      const isFloorHit = rawTargetKcal < floor;
      const targetKcalBeforeMacros = Math.max(rawTargetKcal, floor);

      const targetProteinG = Math.round(proteinGPerKg * currentWeight);
      const targetFatG = Math.round(fatGPerKg * currentWeight);
      const targetCarbG = Math.max(
        0,
        Math.round((targetKcalBeforeMacros - 4 * targetProteinG - 9 * targetFatG) / 4)
      );
      const actualTargetKcal = 4 * targetProteinG + 4 * targetCarbG + 9 * targetFatG;

      days.push({
        day: d,
        date: getDateForDay(profile.startDate, d),
        expectedWeightKg: Math.round(currentWeight * 100) / 100,
        targetKcal: actualTargetKcal,
        targetProteinG,
        targetCarbG,
        targetFatG,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        isFloorHit,
      });

      const actualBurn = tdee - actualTargetKcal;
      const weightDrop = actualBurn / 7700;
      currentWeight = currentWeight - weightDrop;
    }
  }

  return days;
}

export function calculatePlanSummary(profile: UserProfile, days?: PlanDay[]): PlanSummary {
  const planDays = days ?? calculatePlan(profile);
  const day1 = planDays[0];
  const day90 = planDays[planDays.length - 1];

  const totalDropKg = profile.startWeightKg - profile.goalWeightKg;
  const weeklyDropKg = (totalDropKg / 90) * 7;
  const weeklyDropPercentBw = (weeklyDropKg / profile.startWeightKg) * 100;

  const avgDailyDeficit = Math.round(
    planDays.reduce((acc, d) => acc + (d.tdee - d.targetKcal), 0) / planDays.length
  );

  return {
    bmrStart: day1.bmr,
    tdeeStart: day1.tdee,
    avgDailyDeficit,
    kcalDay1: day1.targetKcal,
    kcalDay90: day90.targetKcal,
    totalPlannedDropKg: Math.round(totalDropKg * 100) / 100,
    weeklyDropKg: Math.round(weeklyDropKg * 100) / 100,
    weeklyDropPercentBw: Math.round(weeklyDropPercentBw * 100) / 100,
  };
}
