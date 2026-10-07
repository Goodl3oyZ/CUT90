'use client';

import { useEffect, useState } from 'react';
import { flushOfflineQueue } from '@/lib/offline/queue';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [syncedToast, setSyncedToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOffline(!navigator.onLine);

    const handleOnline = async () => {
      setIsOffline(false);
      const { syncedCount } = await flushOfflineQueue();
      if (syncedCount > 0) {
        setSyncedToast(`ซิงค์ข้อมูลเรียบร้อยแล้ว (${syncedCount} รายการ)`);
        setTimeout(() => setSyncedToast(null), 4000);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync check on mount
    if (navigator.onLine) {
      flushOfflineQueue().then(({ syncedCount }) => {
        if (syncedCount > 0) {
          setSyncedToast(`ซิงค์ข้อมูลเรียบร้อยแล้ว (${syncedCount} รายการ)`);
          setTimeout(() => setSyncedToast(null), 4000);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 font-medium text-xs sm:text-sm px-4 py-2 text-center flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>คุณกำลังใช้งานแบบออฟไลน์ — ข้อมูลจะถูกบันทึกในเครื่องและซิงค์เมื่อออนไลน์</span>
        </div>
      )}

      {syncedToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{syncedToast}</span>
        </div>
      )}
    </>
  );
}
