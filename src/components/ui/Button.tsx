import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] select-none';

    const variantStyles = {
      primary:
        'bg-brass-400 hover:bg-brass-300 text-obsidian-950 font-semibold shadow-sm dark:bg-brass-300 dark:hover:bg-brass-200 dark:text-obsidian-950',
      secondary:
        'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)]',
      ghost:
        'bg-transparent hover:bg-[var(--accent-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
      danger:
        'bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 dark:bg-rose-950/60 dark:hover:bg-rose-900/80',
    };

    const sizeStyles = {
      sm: 'h-9 px-3 text-xs gap-1.5 min-h-[36px]',
      md: 'h-11 px-4 text-sm gap-2 min-h-[44px]', // Meets 44px touch target
      lg: 'h-13 px-6 text-base gap-2.5 min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
