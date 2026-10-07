'use client';

import { useState } from 'react';
import { DailyLogInput, PlanDay } from '@/lib/plan';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Popover } from '@/components/ui/Popover';

interface WeightChartProps {
  planDays: PlanDay[];
  logs: DailyLogInput[];
  goalWeightKg: number;
  recalDay?: number | null;
  todayDayNumber?: number | null;
}

export function WeightChart({
  planDays,
  logs,
  goalWeightKg,
  recalDay,
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

  // Calculate 7-day moving average
  const movingAvgMap = new Map<number, number>();
  const sortedLoggedDays = Array.from(logMap.keys()).sort((a, b) => a - b);

  for (const day of sortedLoggedDays) {
    const window = sortedLoggedDays.filter((d) => d >= day - 6 && d <= day);
    const sum = window.reduce((acc, d) => acc + logMap.get(d)!, 0);
    movingAvgMap.set(day, Math.round((sum / window.length) * 100) / 100);
  }

  // SVG dimensions
  const width = 360;
  const height = 210;
  const padding = { top: 25, right: 25, bottom: 35, left: 40 };

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
  const recalX = recalDay ? getX(recalDay) : null;

  return (
    <Card variant="default" padding="md" className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
            <Icon name="LineChart" size={18} className="text-brass-400" />
            <span>กราฟแนวโน้มน้ำหนัก (90 วัน)</span>
          </h2>
          <Popover
            title="ค่าเฉลี่ย 7 วัน & เส้นแนวโน้ม"
            description="เส้นสีทองแสดงค่าเฉลี่ยเคลื่อนที่ 7 วันเพื่อตัดสิ่งรบกวนจากน้ำหนักน้ำในร่างกาย ส่วนเส้นประแสดงเป้าหมายตามแผนผัง"
            glossaryAnchor="7day-average"
          />
        </div>

        {selectedPoint && (
          <div className="text-xs font-mono font-semibold text-brass-400">
            วัน {selectedPoint.day}: จริง {selectedPoint.weight.toFixed(1)} กก. (แผน {selectedPoint.expected.toFixed(1)} กก.)
          </div>
        )}
      </div>

      {/* SVG Responsive Container */}
      <div className="w-full aspect-[16/9] relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="กราฟแนวโน้มน้ำหนักประจำวันและค่าเฉลี่ย 7 วัน"
        >
          {/* Goal Band Background Shadow */}
          <rect
            x={padding.left}
            y={goalY - 6}
            width={width - padding.left - padding.right}
            height={12}
            fill="currentColor"
            className="text-emerald-500/10"
          />

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
                  className="text-[var(--border-color)]"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[var(--text-muted)] text-[9px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Goal Weight Line (Emerald) */}
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
            className="fill-emerald-500 text-[8px] font-bold font-mono"
          >
            เป้าหมาย {goalWeightKg}kg
          </text>

          {/* Expected Weight Line (Dashed Muted) */}
          <path
            d={expectedPath}
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Recalibration Annotation Marker */}
          {recalX && (
            <g key="recal-marker">
              <line
                x1={recalX}
                y1={padding.top}
                x2={recalX}
                y2={height - padding.bottom}
                stroke="var(--accent-color)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={recalX}
                y={padding.top - 5}
                textAnchor="middle"
                className="fill-brass-400 text-[8px] font-mono font-bold"
              >
                ปรับแผน (Day {recalDay})
              </text>
            </g>
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

          {/* 7-Day Moving Average Line (Solid Brass Accent) */}
          {sortedLoggedDays.length >= 2 && (
            <path
              d={movingAvgPath}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="2.5"
              strokeLinecap="round"
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
                className="fill-brass-400 stroke-[var(--bg-surface)] cursor-pointer hover:r-5 transition-all"
                strokeWidth="1.5"
                onClick={() => setSelectedPoint({ day, weight: w, expected: exp })}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-[11px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-brass-400 rounded-full" />
          <span>เฉลี่ย 7 วัน</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-b border-dashed border-[var(--text-muted)]" />
          <span>แผนตั้งต้น</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-b border-dashed border-emerald-500" />
          <span>เป้าหมาย</span>
        </div>
      </div>
    </Card>
  );
}
