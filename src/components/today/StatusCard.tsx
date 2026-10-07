'use client';

import React from 'react';
import { StatusCardData } from '@/lib/plan';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Ring } from '@/components/ui/Ring';
import { Popover } from '@/components/ui/Popover';
import { Icon } from '@/components/ui/Icon';

interface StatusCardProps {
  data: StatusCardData;
  startWeightKg: number;
  goalWeightKg: number;
  currentDayNumber: number;
}

export function StatusCard({
  data,
  startWeightKg,
  goalWeightKg,
  currentDayNumber,
}: StatusCardProps) {
  const { status, diffKg, loggedDaysCount, meanActualKg, meanExpectedKg } = data;

  const totalToLose = Math.max(0.1, startWeightKg - goalWeightKg);
  const currentActual = meanActualKg ?? startWeightKg;
  const lostSoFar = Math.max(0, startWeightKg - currentActual);
  const remainingToGoal = Math.max(0, currentActual - goalWeightKg);
  const weightProgressPercent = Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100));
  const dayProgressPercent = Math.min(100, Math.max(0, (currentDayNumber / 90) * 100));

  const statusMap = {
    ahead: {
      statusText: 'เร็วกว่าแผน',
      variant: 'ahead' as const,
      sentence: `เร็วกว่าแผน: เฉลี่ย 7 วัน ${meanActualKg ? meanActualKg.toFixed(2) : '-'} kg (เร็วกว่าแผน ${Math.abs(diffKg).toFixed(1)} kg) เหลืออีก ${remainingToGoal.toFixed(1)} kg ถึงเป้าหมาย`,
    },
    on_track: {
      statusText: 'ตามแผน',
      variant: 'on_track' as const,
      sentence: `ตามแผน: เฉลี่ย 7 วัน ${meanActualKg ? meanActualKg.toFixed(2) : '-'} kg เหลืออีก ${remainingToGoal.toFixed(1)} kg ถึงเป้าหมาย`,
    },
    behind: {
      statusText: 'ช้ากว่าแผน',
      variant: 'behind' as const,
      sentence: `ช้ากว่าแผน: เฉลี่ย 7 วัน ${meanActualKg ? meanActualKg.toFixed(2) : '-'} kg (สูงกว่าแผน ${Math.abs(diffKg).toFixed(1)} kg) เหลืออีก ${remainingToGoal.toFixed(1)} kg ถึงเป้าหมาย`,
    },
  }[status];

  return (
    <Card variant="hero" padding="md" className="space-y-4">
      {/* Top Bar: Title & Status Pill & Info Popover */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-brass-400 font-semibold flex items-center gap-1.5">
            <Icon name="Compass" size={15} />
            สถานะภาพรวมประเมินผล 7 วัน
          </span>
          <Popover
            title="สถานะเฉลี่ย 7 วัน"
            description="การคำนวณเปรียบเทียบน้ำหนักเฉลี่ยย้อนหลัง 7 วันกับแผนที่วางไว้ ช่วยลดผลกระทบจากความผันผวนของน้ำหนักรายวัน"
            glossaryAnchor="7day-average"
          />
        </div>
        <Pill label={statusMap.statusText} variant={statusMap.variant} />
      </div>

      {/* Main Single Sentence Answer */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)]/90 border border-[var(--border-color)]">
        <p className="font-display font-semibold text-base sm:text-lg text-[var(--text-primary)] leading-snug">
          {statusMap.sentence}
        </p>
      </div>

      {/* Dual Progress Rings / Stats Bar */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <Ring
            value={dayProgressPercent}
            size={72}
            strokeWidth={6}
            label={`${currentDayNumber}/90`}
            sublabel="วัน"
          />
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">ความคืบหน้าเวลา</span>
            <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
              {currentDayNumber} จาก 90 วัน
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Ring
            value={weightProgressPercent}
            size={72}
            strokeWidth={6}
            label={`${weightProgressPercent.toFixed(0)}%`}
            sublabel="เป้าหมาย"
          />
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">ลดได้แล้ว</span>
            <span className="font-mono font-bold text-sm text-brass-400">
              {lostSoFar.toFixed(1)} กก.
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block font-mono">
              เป้า {goalWeightKg} กก.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
