import React from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface StatTileProps {
  icon: string;
  label: string;
  sublabel?: string;
  actual: number | string;
  target?: number | string;
  unit?: string;
  hint?: string;
  colorTheme?: 'brass' | 'protein' | 'carb' | 'fat' | 'default';
  className?: string;
}

export function StatTile({
  icon,
  label,
  sublabel,
  actual,
  target,
  unit = '',
  hint,
  colorTheme = 'default',
  className,
}: StatTileProps) {
  const iconThemeStyles = {
    brass: 'text-brass-400 bg-brass-400/10',
    protein: 'text-blue-400 bg-blue-500/10',
    carb: 'text-amber-400 bg-amber-500/10',
    fat: 'text-rose-400 bg-rose-500/10',
    default: 'text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)]',
  };

  return (
    <div
      className={clsx(
        'p-3 sm:p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex flex-col justify-between transition-colors',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={clsx('p-1.5 rounded-lg flex items-center justify-center', iconThemeStyles[colorTheme])}>
            <Icon name={icon} size={16} />
          </div>
          <div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
            {sublabel && (
              <span className="block text-[10px] text-[var(--text-muted)] font-mono">{sublabel}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="font-mono text-lg font-bold tabular-nums text-[var(--text-primary)]">
          {actual}
          {target !== undefined && (
            <span className="text-xs font-normal text-[var(--text-muted)]"> / {target}</span>
          )}
          {unit && <span className="text-xs ml-0.5 font-sans font-normal text-[var(--text-secondary)]">{unit}</span>}
        </div>

        {hint && (
          <span className="text-[11px] font-medium text-brass-500 dark:text-brass-300">
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}
