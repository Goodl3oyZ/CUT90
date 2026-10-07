'use client';

import { useState } from 'react';
import { DailyLogInput, PlanDay } from '@/lib/plan';

interface WeightChartProps {
  planDays: PlanDay[];
  logs: DailyLogInput[];
  goalWeightKg: number;
  todayDayNumber?: number | null;
}

export function WeightChart({
  planDays,
  logs,
  goalWeightKg,
  todayDayNumber,
}: WeightChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<{
    day: number;
    weight: number;
    expected: number;
  } | null>(null);

  const logMap = new Map<number, number>();
  for (const l of logs) {
    if (typeof l.weightKg === 'number' && l.weightKg > 0) {
      logMap.set(l.day, l.weightKg);
    }
  }

  // Calculate 7-day moving average for logged weights
  const movingAvgMap = new Map<number, number>();
  const sortedLoggedDays = Array.from(logMap.keys()).sort((a, b) => a - b);

  for (const day of sortedLoggedDays) {
    const window = sortedLoggedDays.filter((d) => d >= day - 6 && d <= day);
    const sum = window.reduce((acc, d) => acc + logMap.get(d)!, 0);
    movingAvgMap.set(day, Math.round((sum / window.length) * 10) / 10);
  }

  // SVG dimensions
  const width = 340;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };

  // Calculate Y domain min/max
  const allWeights = [
    ...planDays.map((p) => p.expectedWeightKg),
    ...Array.from(logMap.values()),
    goalWeightKg,
  ];

  const minWeight = Math.floor(Math.min(...allWeights) - 1);
  const maxWeight = Math.ceil(Math.max(...allWeights) + 1);

  const getX = (day: number) =>
    padding.left + ((day - 1) / 89) * (width - padding.left - padding.right);

  const getY = (w: number) =>
    height -
    padding.bottom -
    ((w - minWeight) / (maxWeight - minWeight)) * (height - padding.top - padding.bottom);

  // Path string for expected weight line
  const expectedPath = planDays
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.expectedWeightKg)}`)
    .join(' ');

  // Path string for 7-day moving average curve
  const movingAvgPath = sortedLoggedDays
    .map((day, i) => `${i === 0 ? 'M' : 'L'} ${getX(day)} ${getY(movingAvgMap.get(day)!)}`)
    .join(' ');

  const goalY = getY(goalWeightKg);
  const todayX = todayDayNumber ? getX(todayDayNumber) : null;

  return (
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          กราฟแนวโน้มน้ำหนัก (90 วัน)
        </h3>
        {selectedPoint && (
          <div className="text-xs font-mono font-medium text-cobalt-600 dark:text-cobalt-400">
            วัน {selectedPoint.day}: จริง {selectedPoint.weight}กก. (แผน {selectedPoint.expected}กก.)
          </div>
        )}
      </div>

      {/* SVG Responsive Container */}
      <div className="w-full aspect-[17/10] relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="กราฟแนวโน้มน้ำหนักประจำวันและค่าเฉลี่ย 7 วัน"
        >
          {/* Y-axis Grid Lines */}
          {[minWeight, Math.round((minWeight + maxWeight) / 2), maxWeight].map((val) => {
            const y = getY(val);
            return (
              <g key={`grid-${val}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Goal Weight Line (Dashed Emerald) */}
          <line
            x1={padding.left}
            y1={goalY}
            x2={width - padding.right}
            y2={goalY}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right}
            y={goalY - 4}
            textAnchor="end"
            className="fill-emerald-500 text-[8px] font-bold"
          >
            เป้าหมาย {goalWeightKg}kg
          </text>

          {/* Expected Weight Line (Dashed Slate) */}
          <path
            d={expectedPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* 7-Day Moving Average Line (Solid Cobalt) */}
          {sortedLoggedDays.length >= 2 && (
            <path
              d={movingAvgPath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Today Vertical Marker Line */}
          {todayX && (
            <line
              x1={todayX}
              y1={padding.top}
              x2={todayX}
              y2={height - padding.bottom}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Daily Log Dots */}
          {sortedLoggedDays.map((day) => {
            const w = logMap.get(day)!;
            const exp = planDays.find((p) => p.day === day)?.expectedWeightKg ?? 0;
            const cx = getX(day);
            const cy = getY(w);
            return (
              <circle
                key={`dot-${day}`}
                cx={cx}
                cy={cy}
                r="3.5"
                className="fill-cobalt-600 dark:fill-cobalt-400 stroke-white dark:stroke-slate-900 cursor-pointer hover:r-5 transition-all"
                strokeWidth="1.5"
                onClick={() => setSelectedPoint({ day, weight: w, expected: exp })}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-cobalt-600 rounded-full" />
          <span>เฉลี่ย 7 วัน</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-b border-dashed border-slate-400" />
          <span>แผน</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-b border-dashed border-emerald-500" />
          <span>เป้าหมาย</span>
        </div>
      </div>
    </div>
  );
}
