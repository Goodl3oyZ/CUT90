/**
 * Timezone-safe date utility operating strictly on YYYY-MM-DD date strings.
 * Avoids UTC-midnight parsing pitfalls.
 */

export function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split('-').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid ISO date string format: "${dateStr}". Expected YYYY-MM-DD.`);
  }
  return { year: parts[0], month: parts[1], day: parts[2] };
}

export function formatDateParts(year: number, month: number, day: number): string {
  const y = year.toString().padStart(4, '0');
  const m = month.toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: string, days: number): string {
  const { year, month, day } = parseDateParts(dateStr);
  // Use UTC Date object strictly for date arithmetic without timezone offset interference
  const d = new Date(Date.UTC(year, month - 1, day + days));
  return formatDateParts(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function diffDays(startDateStr: string, endDateStr: string): number {
  const s = parseDateParts(startDateStr);
  const e = parseDateParts(endDateStr);
  const startUtc = Date.UTC(s.year, s.month - 1, s.day);
  const endUtc = Date.UTC(e.year, e.month - 1, e.day);
  const msPerDay = 86400000;
  return Math.round((endUtc - startUtc) / msPerDay);
}

/**
 * Returns YYYY-MM-DD for a given plan day number (1..90).
 * Day 1 corresponds to startDateStr.
 */
export function getDateForDay(startDateStr: string, dayNumber: number): string {
  return addDays(startDateStr, dayNumber - 1);
}

/**
 * Returns plan day number (1..90) for targetDateStr relative to startDateStr.
 * Returns null if outside 1..90.
 */
export function getDayForDate(startDateStr: string, targetDateStr: string): number | null {
  const diff = diffDays(startDateStr, targetDateStr);
  const day = diff + 1;
  if (day >= 1 && day <= 90) {
    return day;
  }
  return null;
}

export function isValidDateStr(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  try {
    const { year, month, day } = parseDateParts(dateStr);
    const d = new Date(Date.UTC(year, month - 1, day));
    return (
      d.getUTCFullYear() === year &&
      d.getUTCMonth() === month - 1 &&
      d.getUTCDate() === day
    );
  } catch {
    return false;
  }
}

export function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return formatDateParts(y, m, d);
}
