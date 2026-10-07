import React from 'react';
import clsx from 'clsx';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      ariaLabel,
      variant = 'ghost',
      size = 'md',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed active:scale-95';

    const variantStyles = {
      primary: 'bg-brass-400 text-obsidian-950 hover:bg-brass-300',
      secondary: 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-surface-hover)]',
      ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]',
      danger: 'bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 border border-rose-800/40',
    };

    const sizeStyles = {
      sm: 'w-9 h-9 min-w-[36px] min-h-[36px]',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px]', // Touch target requirement >= 44px
      lg: 'w-12 h-12 min-w-[48px] min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
