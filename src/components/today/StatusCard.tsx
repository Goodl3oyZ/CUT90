import { StatusCardData } from '@/lib/plan';
import { TrendingDown, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface StatusCardProps {
  data: StatusCardData;
}

export function StatusCard({ data }: StatusCardProps) {
  const { status, diffKg, loggedDaysCount, meanActualKg, meanExpectedKg } = data;

  const pillConfig = {
    ahead: {
      label: 'เร็วกว่าแผน',
      bgColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      icon: TrendingDown,
    },
    on_track: {
      label: 'ตามแผน',
      bgColor: 'bg-cobalt-500/10 text-cobalt-700 dark:text-cobalt-400 border-cobalt-500/20',
      icon: CheckCircle,
    },
    behind: {
      label: 'ช้ากว่าแผน',
      bgColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      icon: AlertCircle,
    },
  }[status];

  const Icon = pillConfig.icon;

  return (
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          สถานะ 7 วันล่าสุด
        </span>
        <div
          className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
            pillConfig.bgColor
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{pillConfig.label}</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-brand text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {diffKg > 0 ? `+${diffKg.toFixed(1)}` : diffKg.toFixed(1)}
          </span>
          <span className="ml-1 text-sm font-medium text-slate-500">กก. (เทียบแผน)</span>
        </div>

        {loggedDaysCount > 0 && meanActualKg && meanExpectedKg && (
          <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div>เฉลี่ยจริง {meanActualKg.toFixed(1)} กก.</div>
            <div>เฉลี่ยแผน {meanExpectedKg.toFixed(1)} กก.</div>
          </div>
        )}
      </div>

      {loggedDaysCount === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          ยังไม่มีข้อมูลบันทึกน้ำหนักใน 7 วันที่ผ่านมา
        </p>
      )}
    </div>
  );
}
