'use client';

import React from 'react';
import { SideRail } from './SideRail';
import { BottomNav } from '@/components/layout/BottomNav';

export interface NavLayoutProps {
  children: React.ReactNode;
}

export function NavLayout({ children }: NavLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <SideRail />
      <div className="lg:pl-64 min-h-screen pb-24 lg:pb-12">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
