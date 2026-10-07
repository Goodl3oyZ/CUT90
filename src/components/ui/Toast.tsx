import React from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface ToastProps {
  status: 'saving' | 'saved' | 'offline' | 'error';
  message?: string;
  timestamp?: string;
  className?: string;
}

export function Toast({ status, message, timestamp, className }: ToastProps) {
  const config = {
    saving: {
      icon: 'Loader2',
      text: message || 'กำลังบันทึกข้อมูล...',
      style: 'bg-brass-400/10 text-brass-400 border-brass-400/20',
      spin: true,
    },
    saved: {
      icon: 'Check',
      text: message || 'บันทึกอัตโนมัติแล้ว',
      style: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      spin: false,
    },
    offline: {
      icon: 'WifiOff',
      text: message || 'เก็บบันทึกออฟไลน์แล้ว จะซิงค์เมื่อออนไลน์',
      style: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      spin: false,
    },
    error: {
      icon: 'AlertCircle',
      text: message || 'เกิดข้อผิดพลาดในการบันทึก',
      style: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      spin: false,
    },
  }[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-all duration-200 select-none',
        config.style,
        className
      )}
    >
      <Icon
        name={config.icon}
        size={14}
        className={clsx(config.spin && 'animate-spin')}
      />
      <span>{config.text}</span>
      {timestamp && (
        <span className="text-[10px] font-mono opacity-80 border-l border-current/20 pl-2">
          {timestamp}
        </span>
      )}
    </div>
  );
}
