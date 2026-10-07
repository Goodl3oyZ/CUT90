'use client';

import { useState, useEffect } from 'react';
import { SunMoon, LogOut, Flame, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearOfflineQueue } from '@/lib/offline/queue';
import { IconButton } from '@/components/ui/IconButton';

interface HeaderProps {
  username?: string;
  dayNumber?: number;
}

export function Header({ username, dayNumber }: HeaderProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);

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
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] sticky top-0 z-30 px-4 py-3 lg:pl-72">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brass-400 text-obsidian-950 flex items-center justify-center font-display font-bold text-lg shadow-brass-glow">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider text-[var(--text-primary)]">
                CUT 90 PLANNER
              </span>
              {dayNumber && (
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-brass-400/15 text-brass-400 border border-brass-400/30">
                  DAY {dayNumber}/90
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] font-mono hidden sm:block">
              Private-Club Fat-Loss Performance Logbook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            ariaLabel="เปลี่ยนธีม (Light/Dark)"
            onClick={toggleDarkMode}
            variant="ghost"
            size="md"
          >
            <SunMoon className="w-5 h-5 text-brass-400" />
          </IconButton>

          {username && (
            <IconButton
              ariaLabel="ออกจากระบบ"
              onClick={handleLogout}
              variant="ghost"
              size="md"
              className="hover:text-rose-400"
            >
              <LogOut className="w-5 h-5" />
            </IconButton>
          )}
        </div>
      </div>
    </header>
  );
}
