'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Table, LineChart, Settings } from 'lucide-react';
import clsx from 'clsx';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'วันนี้', icon: CalendarDays },
    { href: '/plan', label: 'แผน 90 วัน', icon: Table },
    { href: '/trend', label: 'แนวโน้ม', icon: LineChart },
    { href: '/setup', label: 'ตั้งค่า', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px]',
                isActive
                  ? 'text-cobalt-600 dark:text-cobalt-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'scale-110 transition-transform')} />
              <span className="text-[11px] leading-none font-thai">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
