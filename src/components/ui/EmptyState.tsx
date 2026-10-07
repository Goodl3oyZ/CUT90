import React from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = 'Scale',
  title,
  description,
  actionLabel,
  actionIcon = 'Plus',
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'p-8 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-center flex flex-col items-center justify-center space-y-3',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-[var(--accent-subtle)] text-brass-400 flex items-center justify-center border border-brass-400/20">
        <Icon name={icon} size={24} />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="sm"
          leftIcon={<Icon name={actionIcon} size={14} />}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
