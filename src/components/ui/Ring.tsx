import React from 'react';
import clsx from 'clsx';

export interface RingProps {
  value: number; // percentage 0 - 100
  size?: number; // width & height in px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function Ring({
  value,
  size = 110,
  strokeWidth = 8,
  label,
  sublabel,
  className,
}: RingProps) {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--accent-color)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
          {label && (
            <span className="font-mono text-sm font-bold tabular-nums text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-[var(--text-secondary)] font-medium leading-tight">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
