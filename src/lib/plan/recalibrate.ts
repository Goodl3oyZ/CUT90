import { DailyLogInput, UserProfile } from './types';

/**
 * Computes 7-day average weight ending at targetDay.
 */
export function get7DayAverageWeight(
  targetDay: number,
  logs: DailyLogInput[]
): number | null {
  const windowStart = Math.max(1, targetDay - 6);
  const windowLogs = logs.filter(
    (l) =>
      l.day >= windowStart &&
      l.day <= targetDay &&
      typeof l.weightKg === 'number' &&
      l.weightKg > 0
  );

  if (windowLogs.length === 0) return null;

  const sum = windowLogs.reduce((acc, l) => acc + l.weightKg!, 0);
  return Math.round((sum / windowLogs.length) * 100) / 100;
}

export function recalibrateProfile(
  profile: UserProfile,
  recalDay: number,
  logs: DailyLogInput[]
): UserProfile {
  const avgWeight = get7DayAverageWeight(recalDay, logs);
  const fallbackWeight =
    logs.find((l) => l.day === recalDay)?.weightKg ??
    profile.startWeightKg;

  const newRecalWeight = avgWeight ?? fallbackWeight;

  return {
    ...profile,
    recalDay,
    recalWeightKg: newRecalWeight,
  };
}

export function clearRecalibration(profile: UserProfile): UserProfile {
  return {
    ...profile,
    recalDay: null,
    recalWeightKg: null,
  };
}
