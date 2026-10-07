import React from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  unit?: string;
  helperText?: string;
  errorText?: string;
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, icon, unit, helperText, errorText, className, id, ...props }, ref) => {
    const inputId = id || `field-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="space-y-1.5 w-full">
        <label
          htmlFor={inputId}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]"
        >
          {icon && <Icon name={icon} size={14} className="text-brass-400" />}
          <span>{label}</span>
        </label>

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full h-11 px-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border text-[var(--text-primary)] tabular-nums text-sm focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-transparent transition-all',
              unit ? 'pr-12' : 'pr-3.5',
              errorText
                ? 'border-rose-500/80 focus:ring-rose-500'
                : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]',
              className
            )}
            {...props}
          />
          {unit && (
            <span className="absolute right-3.5 text-xs text-[var(--text-muted)] font-mono pointer-events-none select-none">
              {unit}
            </span>
          )}
        </div>

        {errorText ? (
          <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
            <Icon name="AlertCircle" size={12} />
            <span>{errorText}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-[var(--text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Field.displayName = 'Field';
