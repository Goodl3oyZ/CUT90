'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DailyLogInput } from '@/lib/plan';
import { enqueueOfflineLog } from '@/lib/offline/queue';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Toast } from '@/components/ui/Toast';

interface LogFormProps {
  day: number;
  initialLog?: DailyLogInput | null;
  onSaveSuccess?: (updatedLog: DailyLogInput) => void;
}

export function LogForm({ day, initialLog, onSaveSuccess }: LogFormProps) {
  const [weightKg, setWeightKg] = useState<string>('');
  const [proteinG, setProteinG] = useState<string>('');
  const [carbG, setCarbG] = useState<string>('');
  const [fatG, setFatG] = useState<string>('');
  const [waistCm, setWaistCm] = useState<string>('');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'offline' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const isInitialMount = useRef(true);

  // Sync state when day or initialLog changes
  useEffect(() => {
    isInitialMount.current = true;
    setWeightKg(initialLog?.weightKg != null ? String(initialLog.weightKg) : '');
    setProteinG(initialLog?.proteinG != null ? String(initialLog.proteinG) : '');
    setCarbG(initialLog?.carbG != null ? String(initialLog.carbG) : '');
    setFatG(initialLog?.fatG != null ? String(initialLog.fatG) : '');
    setWaistCm(initialLog?.waistCm != null ? String(initialLog.waistCm) : '');
    setSaveStatus('idle');
  }, [day, initialLog]);

  const parseNum = (val: string): number | null => {
    if (!val || val.trim() === '') return null;
    const clean = val.replace(',', '.');
    const num = parseFloat(clean);
    return isNaN(num) ? null : num;
  };

  // Compute live calorie sum as user types
  const liveP = parseNum(proteinG) ?? 0;
  const liveC = parseNum(carbG) ?? 0;
  const liveF = parseNum(fatG) ?? 0;
  const liveTotalKcal = Math.round(4 * liveP + 4 * liveC + 9 * liveF);

  const saveLog = useCallback(async () => {
    setSaveStatus('saving');

    const logPayload: DailyLogInput = {
      day,
      weightKg: parseNum(weightKg),
      proteinG: parseNum(proteinG) != null ? Math.round(parseNum(proteinG)!) : null,
      carbG: parseNum(carbG) != null ? Math.round(parseNum(carbG)!) : null,
      fatG: parseNum(fatG) != null ? Math.round(parseNum(fatG)!) : null,
      waistCm: parseNum(waistCm),
      updatedAt: Date.now(),
    };

    const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    if (!navigator.onLine) {
      await enqueueOfflineLog(logPayload);
      setSaveStatus('offline');
      setLastSavedTime(timeStr);
      if (onSaveSuccess) onSaveSuccess(logPayload);
      return;
    }

    try {
      const res = await fetch(`/api/logs/${day}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logPayload),
      });

      if (res.ok) {
        const data = await res.json();
        setSaveStatus('saved');
        setLastSavedTime(timeStr);
        if (onSaveSuccess) onSaveSuccess(data.log);
      } else {
        await enqueueOfflineLog(logPayload);
        setSaveStatus('offline');
        setLastSavedTime(timeStr);
      }
    } catch {
      await enqueueOfflineLog(logPayload);
      setSaveStatus('offline');
      setLastSavedTime(timeStr);
    }
  }, [day, weightKg, proteinG, carbG, fatG, waistCm, onSaveSuccess]);

  // Debounced autosave
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveLog();
    }, 600);

    return () => clearTimeout(timer);
  }, [weightKg, proteinG, carbG, fatG, waistCm, saveLog]);

  return (
    <Card variant="default" padding="md" className="space-y-5">
      {/* Header & Status Indicator */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
          <Icon name="SlidersHorizontal" size={18} className="text-brass-400" />
          <span>บันทึกผลประจำวัน (วัน {day})</span>
        </h2>

        {saveStatus !== 'idle' && (
          <Toast status={saveStatus} timestamp={lastSavedTime} />
        )}
      </div>

      {/* Group 1: Body Metrics (น้ำหนัก & สัดส่วน) */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-brass-400 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="Scale" size={14} />
          <span>กลุ่มที่ 1: น้ำหนักและสัดส่วนร่างกาย</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="น้ำหนักเช้าชั่งหลังตื่น"
            icon="Scale"
            unit="กก."
            type="text"
            inputMode="decimal"
            placeholder="เช่น 79.5"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            helperText="ชั่งตอนเช้าหลังเข้าห้องน้ำ ก่อนทานอาหาร"
          />

          <Field
            label="รอบเอวผ่อนลมหายใจ"
            icon="Ruler"
            unit="ซม."
            type="text"
            inputMode="decimal"
            placeholder="เช่น 84.0"
            value={waistCm}
            onChange={(e) => setWaistCm(e.target.value)}
            helperText="วัดระดับสะดือในท่าสบายๆ (ถ้ามี)"
          />
        </div>
      </div>

      {/* Group 2: Nutrition (สารอาหาร & อาหาร) */}
      <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-brass-400 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="Utensils" size={14} />
            <span>กลุ่มที่ 2: สารอาหารที่รับประทานจริง</span>
          </h3>

          <div className="text-xs font-mono font-medium text-[var(--text-secondary)]">
            คำนวณสด: <span className="text-brass-400 font-bold">{liveTotalKcal}</span> kcal
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field
            label="โปรตีน"
            icon="Beef"
            unit="กรัม"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={proteinG}
            onChange={(e) => setProteinG(e.target.value)}
            helperText="4 kcal / กรัม"
          />

          <Field
            label="คาร์โบไฮเดรต"
            icon="Wheat"
            unit="กรัม"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={carbG}
            onChange={(e) => setCarbG(e.target.value)}
            helperText="4 kcal / กรัม"
          />

          <Field
            label="ไขมัน"
            icon="Droplet"
            unit="กรัม"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={fatG}
            onChange={(e) => setFatG(e.target.value)}
            helperText="9 kcal / กรัม"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
          <Icon name="CloudCheck" size={13} className="text-emerald-500" />
          <span>ระบบบันทึกข้อมูลให้อัตโนมัติขณะพิมพ์</span>
        </span>

        <Button
          type="button"
          onClick={saveLog}
          variant="primary"
          size="sm"
          leftIcon={<Icon name="Check" size={14} />}
          isLoading={saveStatus === 'saving'}
        >
          บันทึกทันที
        </Button>
      </div>
    </Card>
  );
}
