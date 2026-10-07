import React from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface PillProps {
  label: string;
  icon?: string;
  variant?: 'ahead' | 'on_track' | 'behind' | 'accent' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export function Pill({
  label,
  icon,
  variant = 'on_track',
  size = 'md',
  className,
}: PillProps) {
  const variantStyles = {
    ahead: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    on_track: 'bg-brass-400/15 text-brass-700 dark:text-brass-300 border-brass-400/30',
    behind: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    accent: 'bg-[var(--accent-subtle)] text-[var(--accent-color)] border border-[var(--accent-color)]/30',
    muted: 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]',
  };

  const defaultIcon = {
    ahead: 'TrendingDown',
    on_track: 'CheckCircle2',
    behind: 'AlertCircle',
    accent: 'Target',
    muted: 'Info',
  }[variant];

  const activeIcon = icon || defaultIcon;

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-full font-semibold border select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Icon name={activeIcon} size={size === 'sm' ? 12 : 14} />
      <span>{label}</span>
    </div>
  );
}
