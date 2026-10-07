'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';
import Link from 'next/link';

export interface PopoverProps {
  title: string;
  description: string;
  glossaryAnchor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Popover({
  title,
  description,
  glossaryAnchor = 'glossary',
  children,
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={clsx('relative inline-flex items-center', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`ข้อมูลเพิ่มเติมเกี่ยวกับ ${title}`}
        className="p-1 rounded-full text-[var(--text-muted)] hover:text-brass-400 hover:bg-[var(--accent-subtle)] focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:outline-none transition-colors"
      >
        {children || <Icon name="CircleHelp" size={15} />}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="false"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[var(--border-color)]">
            <span className="font-semibold text-xs text-brass-400 flex items-center gap-1">
              <Icon name="Info" size={13} />
              {title}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 rounded"
              aria-label="ปิด"
            >
              <Icon name="X" size={12} />
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
            {description}
          </p>

          <Link
            href={`/help#${glossaryAnchor}`}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brass-400 hover:underline"
          >
            <span>อ่านคำอธิบายในคลังศัพท์</span>
            <Icon name="ArrowRight" size={11} />
          </Link>
        </div>
      )}
    </div>
  );
}
