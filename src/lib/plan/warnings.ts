import { PlanDay, PlanWarnings, UserProfile } from './types';
import { calculatePlanSummary } from './math';

export function calculateWarnings(
  profile: UserProfile,
  planDays: PlanDay[]
): PlanWarnings {
  const summary = calculatePlanSummary(profile, planDays);
  const weeklyPercent = summary.weeklyDropPercentBw;

  const isAggressive = weeklyPercent > 1.0;
  const isNearCeiling = weeklyPercent > 0.75 && weeklyPercent <= 1.0;
  const isFloorHit = planDays.some((d) => d.isFloorHit);

  return {
    isAggressive,
    isNearCeiling,
    isFloorHit,
  };
}
