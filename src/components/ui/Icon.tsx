import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string; // Optional aria-label for standalone icon buttons
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  className = '',
  label,
  ...props
}: IconProps) {
  // Access icon component from lucide-react dynamically or via name lookup
  const iconsRecord = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;
  const Component = iconsRecord[name] || LucideIcons.HelpCircle;

  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={!label}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...props}
    />
  );
}
