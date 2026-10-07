'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, LayoutGrid, LineChart, SlidersHorizontal, CircleHelp } from 'lucide-react';
import clsx from 'clsx';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'วันนี้', icon: Sun },
    { href: '/plan', label: 'แผน 90 วัน', icon: LayoutGrid },
    { href: '/trend', label: 'แนวโน้ม', icon: LineChart },
    { href: '/setup', label: 'ตั้งค่า', icon: SlidersHorizontal },
    { href: '/help', label: 'ช่วยเหลือ', icon: CircleHelp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur-md border-t border-[var(--border-color)] pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 transition-all duration-150 min-h-[44px]',
                isActive
                  ? 'text-brass-400 font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2 : 1.75} className={clsx(isActive && 'scale-110')} />
              <span className="text-[10px] leading-none font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
