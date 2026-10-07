'use client';

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
}: SheetProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-obsidian-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={clsx(
          'relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 space-y-4 animate-in slide-in-from-bottom-6 duration-200',
          className
        )}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[var(--border-color)]">
          <div>
            <h2 id="sheet-title" className="font-display font-bold text-xl text-[var(--text-primary)]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
            aria-label="ปิด"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
