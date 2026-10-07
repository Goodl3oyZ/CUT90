'use client';

import React from 'react';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface MacroBarsProps {
  targetKcal: number;
  targetProteinG: number;
  targetCarbG: number;
  targetFatG: number;
  actualProteinG: number;
  actualCarbG: number;
  actualFatG: number;
}

export function MacroBars({
  targetKcal,
  targetProteinG,
  targetCarbG,
  targetFatG,
  actualProteinG,
  actualCarbG,
  actualFatG,
}: MacroBarsProps) {
  const actualKcal = 4 * actualProteinG + 4 * actualCarbG + 9 * actualFatG;

  const getHint = (actual: number, target: number, unit: string) => {
    const diff = target - actual;
    if (diff > 0) return `เหลือ ${diff} ${unit}`;
    if (diff < 0) return `เกิน ${Math.abs(diff)} ${unit}`;
    return `พอดีเป้า`;
  };

  const metrics = [
    {
      name: 'พลังงานรวม',
      engName: 'Calories',
      icon: 'Flame',
      actual: actualKcal,
      target: targetKcal,
      unit: 'kcal',
      color: 'brass' as const,
      isOver: actualKcal > targetKcal * 1.1,
    },
    {
      name: 'โปรตีน',
      engName: 'Protein',
      icon: 'Beef',
      actual: actualProteinG,
      target: targetProteinG,
      unit: 'g',
      color: 'protein' as const,
      isOver: actualProteinG > targetProteinG * 1.1,
    },
    {
      name: 'คาร์โบไฮเดรต',
      engName: 'Carbohydrate',
      icon: 'Wheat',
      actual: actualCarbG,
      target: targetCarbG,
      unit: 'g',
      color: 'carb' as const,
      isOver: actualCarbG > targetCarbG * 1.1,
    },
    {
      name: 'ไขมัน',
      engName: 'Fat',
      icon: 'Droplet',
      actual: actualFatG,
      target: targetFatG,
      unit: 'g',
      color: 'fat' as const,
      isOver: actualFatG > targetFatG * 1.1,
    },
  ];

  return (
    <Card variant="default" padding="md" className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
          <Icon name="Target" size={18} className="text-brass-400" />
          <span>เป้าหมายโภชนาการวันนี้</span>
        </h2>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          เป้าวันนี้ vs ที่กินจริง
        </span>
      </div>

      <div className="space-y-4">
        {metrics.map((m) => {
          const hint = getHint(m.actual, m.target, m.unit);
          const percent = m.target > 0 ? (m.actual / m.target) * 100 : 0;

          return (
            <div key={m.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-brass-400">
                    <Icon name={m.icon} size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{m.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono ml-1.5">
                      ({m.engName})
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-medium font-mono text-brass-500 dark:text-brass-300">
                    {hint}
                  </span>
                  <div className="font-mono text-sm font-bold tabular-nums">
                    <span className={clsx(m.isOver ? 'text-amber-500 font-bold' : 'text-[var(--text-primary)]')}>
                      {m.actual}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-normal"> / {m.target} {m.unit}</span>
                  </div>
                </div>
              </div>

              <ProgressBar
                value={percent}
                colorTheme={m.isOver ? 'warning' : m.color}
                height="md"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
