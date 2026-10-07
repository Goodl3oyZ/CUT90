'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearOfflineQueue } from '@/lib/offline/queue';

interface HeaderProps {
  username?: string;
  dayNumber?: number;
}

export function Header({ username, dayNumber }: HeaderProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await clearOfflineQueue();
      if ('serviceWorker' in navigator && caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      console.error(e);
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-white dark:bg-[#15202b] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cobalt-600 flex items-center justify-center text-white font-brand font-bold text-lg shadow-sm">
            <Flame className="w-5 h-5 fill-current text-amber-300" />
          </div>
          <div>
            <span className="font-brand font-bold text-lg tracking-wider text-slate-900 dark:text-white uppercase">
              CUT 90
            </span>
            {dayNumber && (
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                วัน {dayNumber}/90
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="เปลี่ยนธีม"
            type="button"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {username && (
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="ออกจากระบบ"
              aria-label="ออกจากระบบ"
              type="button"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
