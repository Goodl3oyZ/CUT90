import { DailyLogInput, PlanDay } from '@/lib/plan';

interface WeeklyTableProps {
  planDays: PlanDay[];
  logs: DailyLogInput[];
}

export function WeeklyTable({ planDays, logs }: WeeklyTableProps) {
  const logMap = new Map<number, DailyLogInput>();
  for (const l of logs) {
    logMap.set(l.day, l);
  }

  // Build weekly summaries (Weeks 1 to 13)
  const weeksData = [];
  for (let w = 1; w <= 13; w++) {
    const startDayNum = (w - 1) * 7 + 1;
    const endDayNum = Math.min(90, w * 7);

    const weekPlanDays = planDays.filter((p) => p.day >= startDayNum && p.day <= endDayNum);
    const startExpWeight = weekPlanDays[0]?.expectedWeightKg ?? 0;
    const endExpWeight = weekPlanDays[weekPlanDays.length - 1]?.expectedWeightKg ?? 0;
    const expDropKg = Math.round((startExpWeight - endExpWeight) * 100) / 100;

    const avgExpKcal = Math.round(
      weekPlanDays.reduce((acc, p) => acc + p.targetKcal, 0) / weekPlanDays.length
    );

    // Calculate actual logged weights in this week
    const weekLogs = logs.filter(
      (l) => l.day >= startDayNum && l.day <= endDayNum && typeof l.weightKg === 'number'
    );
    const avgActWeight =
      weekLogs.length > 0
        ? Math.round(
            (weekLogs.reduce((acc, l) => acc + l.weightKg!, 0) / weekLogs.length) * 10
          ) / 10
        : null;

    // Calculate actual logged calories in this week
    const weekKcalLogs = logs.filter(
      (l) =>
        l.day >= startDayNum &&
        l.day <= endDayNum &&
        (l.proteinG != null || l.carbG != null || l.fatG != null)
    );
    const avgActKcal =
      weekKcalLogs.length > 0
        ? Math.round(
            weekKcalLogs.reduce(
              (acc, l) =>
                acc + (4 * (l.proteinG ?? 0) + 4 * (l.carbG ?? 0) + 9 * (l.fatG ?? 0)),
              0
            ) / weekKcalLogs.length
          )
        : null;

    weeksData.push({
      week: w,
      startExpWeight,
      endExpWeight,
      expDropKg,
      avgExpKcal,
      avgActWeight,
      avgActKcal,
    });
  }

  return (
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
        สรุปรายสัปดาห์ (13 สัปดาห์)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs tabular-nums">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold uppercase">
            <tr>
              <th className="py-2.5 px-3">สัปดาห์</th>
              <th className="py-2.5 px-3">น.น. แผน (กก.)</th>
              <th className="py-2.5 px-3">น.น. จริงเฉลี่ย</th>
              <th className="py-2.5 px-3">ลดเป้าหมาย</th>
              <th className="py-2.5 px-3">แคลอรี่เฉลี่ย (แผน/จริง)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {weeksData.map((row) => (
              <tr key={`week-summary-${row.week}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                  สัปดาห์ {row.week}
                </td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                  {row.startExpWeight.toFixed(1)} → {row.endExpWeight.toFixed(1)}
                </td>
                <td className="py-2.5 px-3 text-cobalt-600 dark:text-cobalt-400 font-medium">
                  {row.avgActWeight != null ? `${row.avgActWeight.toFixed(1)} กก.` : '-'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                  -{row.expDropKg.toFixed(2)} กก.
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                  {row.avgExpKcal} / {row.avgActKcal != null ? row.avgActKcal : '-'} kcal
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
