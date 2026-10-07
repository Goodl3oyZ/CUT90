import React from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={clsx(
        'flex items-center p-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl gap-1',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex-1 h-9 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 select-none',
              isActive
                ? 'bg-brass-400 text-obsidian-950 font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]'
            )}
          >
            {tab.icon && <Icon name={tab.icon} size={14} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
