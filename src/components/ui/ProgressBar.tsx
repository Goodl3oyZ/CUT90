import React from 'react';
import clsx from 'clsx';

export interface ProgressBarProps {
  value: number; // percentage 0 - 100
  max?: number;
  height?: 'sm' | 'md' | 'lg';
  colorTheme?: 'brass' | 'protein' | 'carb' | 'fat' | 'good' | 'warning' | 'critical';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  height = 'md',
  colorTheme = 'brass',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const themeStyles = {
    brass: 'bg-brass-400 dark:bg-brass-300',
    protein: 'bg-blue-500 dark:bg-blue-400',
    carb: 'bg-amber-500 dark:bg-amber-400',
    fat: 'bg-rose-500 dark:bg-rose-400',
    good: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    critical: 'bg-rose-600 dark:bg-rose-500',
  };

  return (
    <div
      className={clsx(
        'w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-full overflow-hidden p-0.5',
        heightStyles[height],
        className
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-300 ease-out',
          themeStyles[colorTheme]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
