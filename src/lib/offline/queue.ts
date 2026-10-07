import { getOfflineDb } from './db';
import { DailyLogInput } from '../plan/types';

export async function enqueueOfflineLog(log: DailyLogInput): Promise<void> {
  const db = await getOfflineDb();
  if (!db) return;
  await db.put('pendingLogs', {
    day: log.day,
    weightKg: log.weightKg ?? null,
    proteinG: log.proteinG ?? null,
    carbG: log.carbG ?? null,
    fatG: log.fatG ?? null,
    waistCm: log.waistCm ?? null,
    updatedAt: log.updatedAt ?? Date.now(),
  });
}

export async function getPendingOfflineLogs(): Promise<DailyLogInput[]> {
  const db = await getOfflineDb();
  if (!db) return [];
  return (await db.getAll('pendingLogs')) as DailyLogInput[];
}

export async function clearOfflineQueue(): Promise<void> {
  const db = await getOfflineDb();
  if (!db) return;
  await db.clear('pendingLogs');
}

export async function flushOfflineQueue(): Promise<{ syncedCount: number }> {
  const pending = await getPendingOfflineLogs();
  if (pending.length === 0) return { syncedCount: 0 };

  let syncedCount = 0;
  for (const log of pending) {
    try {
      const res = await fetch(`/api/logs/${log.day}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });

      if (res.ok) {
        const db = await getOfflineDb();
        if (db) {
          await db.delete('pendingLogs', log.day);
        }
        syncedCount++;
      }
    } catch {
      // Remain in queue if network error occurs
      break;
    }
  }

  return { syncedCount };
}
