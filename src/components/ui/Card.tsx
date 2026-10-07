import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hero' | 'glass' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default:
      'bg-[var(--bg-surface)] card-hairline shadow-sm rounded-2xl',
    hero:
      'hero-gradient card-hairline shadow-brass-glow rounded-2xl relative overflow-hidden',
    glass:
      'bg-[var(--bg-surface)]/80 backdrop-blur-md card-hairline rounded-2xl',
    outlined:
      'bg-transparent border border-[var(--border-color)] rounded-2xl',
  };

  return (
    <div
      className={clsx(
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
