import clsx from 'clsx';

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

  const kcalPercent = targetKcal > 0 ? (actualKcal / targetKcal) * 100 : 0;
  const proteinPercent = targetProteinG > 0 ? (actualProteinG / targetProteinG) * 100 : 0;
  const carbPercent = targetCarbG > 0 ? (actualCarbG / targetCarbG) * 100 : 0;
  const fatPercent = targetFatG > 0 ? (actualFatG / targetFatG) * 100 : 0;

  const isKcalOver = kcalPercent > 110;
  const isProteinOver = proteinPercent > 110;
  const isCarbOver = carbPercent > 110;
  const isFatOver = fatPercent > 110;

  return (
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Total Calorie Bar */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            พลังงาน (kcal)
          </span>
          <div className="font-brand font-bold text-lg tabular-nums">
            <span className={clsx(isKcalOver ? 'text-amber-500 font-bold' : 'text-slate-900 dark:text-white')}>
              {actualKcal}
            </span>
            <span className="text-slate-400 text-sm font-normal"> / {targetKcal} kcal</span>
          </div>
        </div>

        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full transition-all duration-300 rounded-full',
              isKcalOver ? 'bg-amber-500' : 'bg-cobalt-600'
            )}
            style={{ width: `${Math.min(100, kcalPercent)}%` }}
          />
        </div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Protein */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-cobalt-600 dark:text-cobalt-400">โปรตีน</span>
            <span className="tabular-nums font-mono text-slate-500 dark:text-slate-400 text-[11px]">
              {actualProteinG}/{targetProteinG}g
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-300 rounded-full',
                isProteinOver ? 'bg-amber-500' : 'bg-cobalt-600'
              )}
              style={{ width: `${Math.min(100, proteinPercent)}%` }}
            />
          </div>
        </div>

        {/* Carb */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-amber-600 dark:text-amber-400">คาร์บ</span>
            <span className="tabular-nums font-mono text-slate-500 dark:text-slate-400 text-[11px]">
              {actualCarbG}/{targetCarbG}g
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-300 rounded-full',
                isCarbOver ? 'bg-amber-500' : 'bg-amber-500'
              )}
              style={{ width: `${Math.min(100, carbPercent)}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-rose-600 dark:text-rose-400">ไขมัน</span>
            <span className="tabular-nums font-mono text-slate-500 dark:text-slate-400 text-[11px]">
              {actualFatG}/{targetFatG}g
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-300 rounded-full',
                isFatOver ? 'bg-amber-500' : 'bg-rose-500'
              )}
              style={{ width: `${Math.min(100, fatPercent)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
