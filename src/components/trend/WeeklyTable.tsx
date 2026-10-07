'use client';

import React from 'react';
import { DailyLogInput, PlanDay } from '@/lib/plan';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';

interface WeeklyTableProps {
  planDays: PlanDay[];
  logs: DailyLogInput[];
}

export function WeeklyTable({ planDays, logs }: WeeklyTableProps) {
  const logMap = new Map<number, DailyLogInput>();
  for (const l of logs) {
    logMap.set(l.day, l);
  }

  // Calculate 13 weeks stats
  const weeksStats = [];
  for (let w = 1; w <= 13; w++) {
    const startDay = (w - 1) * 7 + 1;
    const endDay = Math.min(90, w * 7);

    const weekPlanDays = planDays.filter((p) => p.day >= startDay && p.day <= endDay);
    const expectedEndWeight = weekPlanDays[weekPlanDays.length - 1]?.expectedWeightKg ?? 0;

    const loggedInWeek = logs.filter(
      (l) => l.day >= startDay && l.day <= endDay && l.weightKg != null && l.weightKg > 0
    );

    let actualEndWeight: number | null = null;
    if (loggedInWeek.length > 0) {
      actualEndWeight = loggedInWeek[loggedInWeek.length - 1].weightKg ?? null;
    }

    const diff = actualEndWeight != null ? actualEndWeight - expectedEndWeight : null;

    weeksStats.push({
      weekNum: w,
      startDay,
      endDay,
      expectedEndWeight,
      actualEndWeight,
      diff,
      loggedDaysCount: loggedInWeek.length,
    });
  }

  return (
    <Card variant="default" padding="md" className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
          <Icon name="CalendarCheck" size={18} className="text-brass-400" />
          <span>สรุปผลต่างรายสัปดาห์ (Weekly Summary)</span>
        </h2>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          13 สัปดาห์
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider border-b border-[var(--border-color)]">
            <tr>
              <th className="py-2.5 px-3">สัปดาห์</th>
              <th className="py-2.5 px-3">แผน (กก.)</th>
              <th className="py-2.5 px-3">จริง (กก.)</th>
              <th className="py-2.5 px-3">ส่วนต่าง (กก.)</th>
              <th className="py-2.5 px-3">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] tabular-nums">
            {weeksStats.map((st) => {
              const hasData = st.actualEndWeight != null;
              const diffText =
                st.diff != null
                  ? st.diff > 0
                    ? `+${st.diff.toFixed(1)}`
                    : st.diff.toFixed(1)
                  : '-';

              return (
                <tr key={`week-${st.weekNum}`} className="hover:bg-[var(--bg-surface-hover)]">
                  <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">
                    สัปดาห์ {st.weekNum}
                    <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                      (วัน {st.startDay}-{st.endDay})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[var(--text-primary)]">
                    {st.expectedEndWeight.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-brass-400">
                    {st.actualEndWeight != null ? st.actualEndWeight.toFixed(1) : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span
                      className={
                        st.diff != null
                          ? st.diff <= 0
                            ? 'text-emerald-500 font-bold'
                            : 'text-amber-500 font-bold'
                          : 'text-[var(--text-muted)]'
                      }
                    >
                      {diffText}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {hasData ? (
                      st.diff != null && Math.abs(st.diff) <= 0.5 ? (
                        <Pill label="ตามแผน" variant="on_track" size="sm" />
                      ) : st.diff != null && st.diff < -0.5 ? (
                        <Pill label="เร็วกว่าแผน" variant="ahead" size="sm" />
                      ) : (
                        <Pill label="ช้ากว่าแผน" variant="behind" size="sm" />
                      )
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        ยังไม่ถึงกำหนด
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
