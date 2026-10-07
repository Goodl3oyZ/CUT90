'use client';

import React, { useState } from 'react';
import { DailyLogInput, PlanDay } from '@/lib/plan';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';

interface PlanTableProps {
  planDays: PlanDay[];
  logs: DailyLogInput[];
  todayDayNumber?: number | null;
}

export function PlanTable({ planDays, logs, todayDayNumber }: PlanTableProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const logMap = new Map<number, DailyLogInput>();
  for (const l of logs) {
    logMap.set(l.day, l);
  }

  const isWithin10Percent = (actual: number | null | undefined, target: number): boolean => {
    if (actual == null || target <= 0) return false;
    const diffRatio = Math.abs(actual - target) / target;
    return diffRatio <= 0.1;
  };

  const getCellBg = (actual: number | null | undefined, target: number) => {
    if (actual == null) return '';
    return isWithin10Percent(actual, target)
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold'
      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold';
  };

  // Group days into weeks (Week 1 = Days 1..7, etc.)
  const weeks: { weekNum: number; days: PlanDay[] }[] = [];
  for (let i = 0; i < planDays.length; i += 7) {
    const chunk = planDays.slice(i, i + 7);
    weeks.push({
      weekNum: Math.floor(i / 7) + 1,
      days: chunk,
    });
  }

  const jumpToToday = () => {
    if (todayDayNumber) {
      const el = document.getElementById(`day-row-${todayDayNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        router.push(`/?day=${todayDayNumber}`);
      }
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Controls & View Mode Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tabs
            tabs={[
              { id: 'table', label: 'ตาราง (Table)', icon: 'Table2' },
              { id: 'cards', label: 'การ์ด (Cards)', icon: 'LayoutGrid' },
            ]}
            activeTab={viewMode}
            onChange={(id) => setViewMode(id as 'table' | 'cards')}
          />
        </div>

        {todayDayNumber && (
          <Button
            onClick={jumpToToday}
            variant="primary"
            size="sm"
            leftIcon={<Icon name="CalendarCheck" size={14} />}
            className="shadow-brass-glow"
          >
            ไปวันนี้ (Day {todayDayNumber})
          </Button>
        )}
      </div>

      {/* Legend Banner */}
      <Card variant="default" padding="sm" className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
            <span className="text-[var(--text-secondary)]">อยู่ในแผน (±10%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40" />
            <span className="text-[var(--text-secondary)]">ต่างจากแผน ({'>'}10%)</span>
          </div>
        </div>
        <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
          คลิกที่แถวเพื่อแก้ไขข้อมูลวันนั้น
        </span>
      </Card>

      {/* VIEW MODE 1: DETAILED STICKY TABLE */}
      {viewMode === 'table' ? (
        <Card variant="default" padding="none" className="overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-240px)] relative">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[var(--bg-surface-elevated)] sticky top-0 z-20 text-[var(--text-secondary)] font-semibold uppercase tracking-wider border-b border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-3 sticky left-0 z-30 bg-[var(--bg-surface-elevated)] border-r border-[var(--border-color)] min-w-[100px]">
                    วัน / วันที่
                  </th>
                  <th className="py-3 px-3 min-w-[110px]">น้ำหนัก (แผน/จริง)</th>
                  <th className="py-3 px-3 min-w-[110px]">แคลอรี่ (แผน/จริง)</th>
                  <th className="py-3 px-3 min-w-[100px]">โปรตีน (g)</th>
                  <th className="py-3 px-3 min-w-[100px]">คาร์บ (g)</th>
                  <th className="py-3 px-3 min-w-[100px]">ไขมัน (g)</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-color)] tabular-nums">
                {weeks.map((week) => {
                  const startWeight = week.days[0].expectedWeightKg;
                  const endWeight = week.days[week.days.length - 1].expectedWeightKg;
                  const weekLoss = (startWeight - endWeight).toFixed(2);
                  const avgKcal = Math.round(
                    week.days.reduce((a, b) => a + b.targetKcal, 0) / week.days.length
                  );

                  return (
                    <React.Fragment key={`week-${week.weekNum}`}>
                      {/* Week Header Row */}
                      <tr className="bg-[var(--bg-surface-elevated)]/90 text-brass-400 font-semibold uppercase tracking-wider text-[11px]">
                        <td
                          colSpan={6}
                          className="py-2.5 px-3 sticky left-0 z-10 bg-[var(--bg-surface-elevated)]/90 border-y border-[var(--border-color)]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold">
                              <Icon name="Calendar" size={13} />
                              สัปดาห์ที่ {week.weekNum}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--text-secondary)] font-normal">
                              เฉลี่ย {avgKcal} kcal/วัน | แผนลดลง ~{weekLoss} กก.
                            </span>
                          </div>
                        </td>
                      </tr>

                      {week.days.map((pd) => {
                        const log = logMap.get(pd.day);
                        const isToday = pd.day === todayDayNumber;
                        const actualKcal =
                          log && (log.proteinG != null || log.carbG != null || log.fatG != null)
                            ? 4 * (log.proteinG ?? 0) + 4 * (log.carbG ?? 0) + 9 * (log.fatG ?? 0)
                            : null;

                        return (
                          <tr
                            id={`day-row-${pd.day}`}
                            key={pd.day}
                            onClick={() => router.push(`/?day=${pd.day}`)}
                            className={clsx(
                              'cursor-pointer transition-colors hover:bg-[var(--bg-surface-hover)]',
                              isToday &&
                                'bg-brass-400/15 dark:bg-brass-400/20 font-medium border-l-4 border-l-brass-400'
                            )}
                          >
                            <td className="py-2.5 px-3 sticky left-0 z-10 bg-[var(--bg-surface)] border-r border-[var(--border-color)] font-medium">
                              <div className="flex items-center gap-1">
                                <span className="text-[var(--text-primary)]">วัน {pd.day}</span>
                                {isToday && (
                                  <span className="text-[9px] font-mono bg-brass-400 text-obsidian-950 px-1 rounded">
                                    Today
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[var(--text-muted)] font-mono">
                                {pd.date.slice(5)}
                              </div>
                            </td>

                            <td className={clsx('py-2.5 px-3', getCellBg(log?.weightKg, pd.expectedWeightKg))}>
                              <div>{pd.expectedWeightKg.toFixed(1)} กก.</div>
                              <div className="text-[11px] text-[var(--text-muted)]">
                                {log?.weightKg != null ? `${log.weightKg.toFixed(1)} กก.` : '-'}
                              </div>
                            </td>

                            <td className={clsx('py-2.5 px-3', getCellBg(actualKcal, pd.targetKcal))}>
                              <div>{pd.targetKcal} kcal</div>
                              <div className="text-[11px] text-[var(--text-muted)]">
                                {actualKcal != null ? `${actualKcal} kcal` : '-'}
                              </div>
                            </td>

                            <td className={clsx('py-2.5 px-3', getCellBg(log?.proteinG, pd.targetProteinG))}>
                              <div>{pd.targetProteinG}g</div>
                              <div className="text-[11px] text-[var(--text-muted)]">
                                {log?.proteinG != null ? `${log.proteinG}g` : '-'}
                              </div>
                            </td>

                            <td className={clsx('py-2.5 px-3', getCellBg(log?.carbG, pd.targetCarbG))}>
                              <div>{pd.targetCarbG}g</div>
                              <div className="text-[11px] text-[var(--text-muted)]">
                                {log?.carbG != null ? `${log.carbG}g` : '-'}
                              </div>
                            </td>

                            <td className={clsx('py-2.5 px-3', getCellBg(log?.fatG, pd.targetFatG))}>
                              <div>{pd.targetFatG}g</div>
                              <div className="text-[11px] text-[var(--text-muted)]">
                                {log?.fatG != null ? `${log.fatG}g` : '-'}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* VIEW MODE 2: MOBILE CARD LIST */
        <div className="space-y-4">
          {weeks.map((week) => (
            <div key={`card-week-${week.weekNum}`} className="space-y-2">
              <div className="text-xs font-semibold text-brass-400 uppercase tracking-wider flex items-center justify-between px-1">
                <span>สัปดาห์ที่ {week.weekNum}</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  เป้าเฉลี่ย {Math.round(week.days.reduce((a, b) => a + b.targetKcal, 0) / 7)} kcal
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {week.days.map((pd) => {
                  const log = logMap.get(pd.day);
                  const isToday = pd.day === todayDayNumber;
                  const actualKcal =
                    log && (log.proteinG != null || log.carbG != null || log.fatG != null)
                      ? 4 * (log.proteinG ?? 0) + 4 * (log.carbG ?? 0) + 9 * (log.fatG ?? 0)
                      : null;

                  return (
                    <Card
                      id={`day-card-${pd.day}`}
                      key={pd.day}
                      variant={isToday ? 'hero' : 'default'}
                      padding="sm"
                      onClick={() => router.push(`/?day=${pd.day}`)}
                      className="cursor-pointer space-y-2 hover:border-brass-400 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[var(--text-primary)]">
                            วัน {pd.day}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] font-mono">
                            {pd.date}
                          </span>
                        </div>
                        {isToday && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brass-400 text-obsidian-950">
                            วันนี้
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
                        <div>
                          <span className="text-[10px] text-[var(--text-secondary)] block">น้ำหนัก (เป้า/จริง)</span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {pd.expectedWeightKg.toFixed(1)} / {log?.weightKg != null ? `${log.weightKg.toFixed(1)} กก.` : '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-secondary)] block">พลังงาน (เป้า/จริง)</span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {pd.targetKcal} / {actualKcal != null ? `${actualKcal} kcal` : '-'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1">
                        <span>P: {pd.targetProteinG}g</span>
                        <span>C: {pd.targetCarbG}g</span>
                        <span>F: {pd.targetFatG}g</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
