import { DailyLogInput, PlanDay, StatusCardData, StatusPill } from './types';

/**
 * Calculates 7-day weight status comparing actual logged weight vs expected weight.
 * Selects logged weights in the 7-day window ending at the latest logged day.
 */
export function calculateStatus(
  logs: DailyLogInput[],
  planDays: PlanDay[]
): StatusCardData {
  const planMap = new Map<number, PlanDay>();
  for (const pd of planDays) {
    planMap.set(pd.day, pd);
  }

  // Filter logs with valid weightKg
  const weightLogs = logs
    .filter((l) => typeof l.weightKg === 'number' && l.weightKg > 0)
    .sort((a, b) => a.day - b.day);

  if (weightLogs.length === 0) {
    return {
      status: 'on_track',
      diffKg: 0,
      loggedDaysCount: 0,
      meanActualKg: null,
      meanExpectedKg: null,
    };
  }

  const latestLoggedDay = weightLogs[weightLogs.length - 1].day;
  const windowStartDay = Math.max(1, latestLoggedDay - 6);

  const windowLogs = weightLogs.filter(
    (l) => l.day >= windowStartDay && l.day <= latestLoggedDay
  );

  if (windowLogs.length === 0) {
    return {
      status: 'on_track',
      diffKg: 0,
      loggedDaysCount: 0,
      meanActualKg: null,
      meanExpectedKg: null,
    };
  }

  let totalActual = 0;
  let totalExpected = 0;
  let count = 0;

  for (const log of windowLogs) {
    const expected = planMap.get(log.day)?.expectedWeightKg;
    if (typeof expected === 'number') {
      totalActual += log.weightKg!;
      totalExpected += expected;
      count++;
    }
  }

  if (count === 0) {
    return {
      status: 'on_track',
      diffKg: 0,
      loggedDaysCount: 0,
      meanActualKg: null,
      meanExpectedKg: null,
    };
  }

  const meanActual = totalActual / count;
  const meanExpected = totalExpected / count;
  const diffKg = Math.round((meanActual - meanExpected) * 100) / 100;

  let status: StatusPill = 'on_track';
  if (diffKg < -0.3) {
    status = 'ahead';
  } else if (diffKg > 0.4) {
    status = 'behind';
  }

  return {
    status,
    diffKg,
    loggedDaysCount: count,
    meanActualKg: Math.round(meanActual * 100) / 100,
    meanExpectedKg: Math.round(meanExpected * 100) / 100,
  };
}
