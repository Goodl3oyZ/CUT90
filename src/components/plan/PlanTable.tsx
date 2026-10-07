'use client';

import { DailyLogInput, PlanDay } from '@/lib/plan';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface PlanTableProps {
  planDays: PlanDay[];
  logs: DailyLogInput[];
  todayDayNumber?: number | null;
}

export function PlanTable({ planDays, logs, todayDayNumber }: PlanTableProps) {
  const router = useRouter();

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

  // Group days into weeks (Week 1 = Days 1..7, Week 2 = Days 8..14, etc.)
  const weeks: { weekNum: number; days: PlanDay[] }[] = [];
  for (let i = 0; i < planDays.length; i += 7) {
    const chunk = planDays.slice(i, i + 7);
    weeks.push({
      weekNum: Math.floor(i / 7) + 1,
      days: chunk,
    });
  }

  return (
    <div className="bg-white dark:bg-[#15202b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-[calc(100vh-220px)] relative">
        <table className="w-full text-left text-xs border-collapse">
          {/* Sticky Header */}
          <thead className="bg-slate-100 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3 sticky left-0 z-30 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-w-[100px]">
                วัน / วันที่
              </th>
              <th className="py-3 px-3 min-w-[110px]">น้ำหนัก (แผน/จริง)</th>
              <th className="py-3 px-3 min-w-[110px]">แคลอรี่ (แผน/จริง)</th>
              <th className="py-3 px-3 min-w-[100px]">โปรตีน (g)</th>
              <th className="py-3 px-3 min-w-[100px]">คาร์บ (g)</th>
              <th className="py-3 px-3 min-w-[100px]">ไขมัน (g)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 tabular-nums">
            {weeks.map((week) => (
              <ReactFragment key={`week-${week.weekNum}`}>
                {/* Week Header Row */}
                <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <td
                    colSpan={6}
                    className="py-2 px-3 sticky left-0 z-10 bg-slate-50 dark:bg-slate-950/70 border-y border-slate-200 dark:border-slate-800"
                  >
                    สัปดาห์ที่ {week.weekNum}
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
                      key={pd.day}
                      onClick={() => router.push(`/?day=${pd.day}`)}
                      className={clsx(
                        'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                        isToday &&
                          'bg-cobalt-500/10 dark:bg-cobalt-500/20 font-medium border-l-4 border-l-cobalt-600'
                      )}
                    >
                      {/* Sticky First Column */}
                      <td className="py-2.5 px-3 sticky left-0 z-10 bg-white dark:bg-[#15202b] border-r border-slate-200 dark:border-slate-800 font-medium">
                        <div className="text-slate-900 dark:text-slate-100">วัน {pd.day}</div>
                        <div className="text-[10px] text-slate-400">{pd.date.slice(5)}</div>
                      </td>

                      {/* Weight */}
                      <td className={clsx('py-2.5 px-3', getCellBg(log?.weightKg, pd.expectedWeightKg))}>
                        <div>{pd.expectedWeightKg.toFixed(1)}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {log?.weightKg != null ? log.weightKg.toFixed(1) : '-'}
                        </div>
                      </td>

                      {/* Kcal */}
                      <td className={clsx('py-2.5 px-3', getCellBg(actualKcal, pd.targetKcal))}>
                        <div>{pd.targetKcal}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {actualKcal != null ? actualKcal : '-'}
                        </div>
                      </td>

                      {/* Protein */}
                      <td className={clsx('py-2.5 px-3', getCellBg(log?.proteinG, pd.targetProteinG))}>
                        <div>{pd.targetProteinG}g</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {log?.proteinG != null ? `${log.proteinG}g` : '-'}
                        </div>
                      </td>

                      {/* Carb */}
                      <td className={clsx('py-2.5 px-3', getCellBg(log?.carbG, pd.targetCarbG))}>
                        <div>{pd.targetCarbG}g</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {log?.carbG != null ? `${log.carbG}g` : '-'}
                        </div>
                      </td>

                      {/* Fat */}
                      <td className={clsx('py-2.5 px-3', getCellBg(log?.fatG, pd.targetFatG))}>
                        <div>{pd.targetFatG}g</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {log?.fatG != null ? `${log.fatG}g` : '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </ReactFragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
const ReactFragment = React.Fragment;
