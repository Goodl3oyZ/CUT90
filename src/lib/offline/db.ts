import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Cut90OfflineDB extends DBSchema {
  pendingLogs: {
    key: number; // day number 1..90
    value: {
      day: number;
      weightKg?: number | null;
      proteinG?: number | null;
      carbG?: number | null;
      fatG?: number | null;
      waistCm?: number | null;
      updatedAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<Cut90OfflineDB>> | null = null;

export function getOfflineDb() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<Cut90OfflineDB>('cut90_offline_db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pendingLogs')) {
          db.createObjectStore('pendingLogs', { keyPath: 'day' });
        }
      },
    });
  }
  return dbPromise;
}
