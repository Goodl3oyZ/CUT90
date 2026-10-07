'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'วันนี้ (Today)', icon: 'Sun' },
  { href: '/plan', label: 'ตาราง 90 วัน (Plan)', icon: 'LayoutGrid' },
  { href: '/trend', label: 'แนวโน้ม (Trend)', icon: 'LineChart' },
  { href: '/setup', label: 'ตั้งค่า (Setup)', icon: 'SlidersHorizontal' },
  { href: '/help', label: 'คู่มือ & ช่วยเหลือ', icon: 'CircleHelp' },
];

export function SideRail() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-[var(--bg-surface)] border-r border-[var(--border-color)] z-40 p-4 justify-between">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="px-3 pt-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brass-400 text-obsidian-950 flex items-center justify-center font-display font-bold text-xl shadow-brass-glow">
            C90
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none text-[var(--text-primary)]">
              CUT 90
            </h1>
            <p className="text-[10px] text-[var(--text-secondary)] font-mono tracking-wider uppercase mt-1">
              Performance Logbook
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5" aria-label="เมนูหลัก">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 select-none',
                  isActive
                    ? 'bg-brass-400 text-obsidian-950 font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]'
                )}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="px-3 py-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-brass-400">
          <Icon name="ShieldCheck" size={14} />
          <span>Cut 90 Planner v1.0</span>
        </div>
        <p>วิทยาศาสตร์การผลาญไขมันใน 90 วัน</p>
      </div>
    </aside>
  );
}
