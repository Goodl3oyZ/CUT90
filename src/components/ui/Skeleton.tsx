import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    card: 'h-32 w-full rounded-2xl',
    circle: 'h-10 w-10 rounded-full',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]/50',
        variantStyles[variant],
        className
      )}
      aria-hidden="true"
    />
  );
}
