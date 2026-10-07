import React from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  icon?: string;
  helperText?: string;
  errorText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, icon, helperText, errorText, className, id, ...props }, ref) => {
    const selectId = id || `select-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="space-y-1.5 w-full">
        <label
          htmlFor={selectId}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]"
        >
          {icon && <Icon name={icon} size={14} className="text-brass-400" />}
          <span>{label}</span>
        </label>

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'w-full h-11 pl-3.5 pr-10 rounded-xl bg-[var(--bg-surface-elevated)] border text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-brass-400 focus:border-transparent appearance-none transition-all cursor-pointer',
              errorText
                ? 'border-rose-500/80 focus:ring-rose-500'
                : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-[var(--text-secondary)]">
            <Icon name="ChevronDown" size={16} />
          </div>
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

Select.displayName = 'Select';
