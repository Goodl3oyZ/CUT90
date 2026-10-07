'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DailyLogInput } from '@/lib/plan';
import { enqueueOfflineLog } from '@/lib/offline/queue';
import { Save, Check, Loader2 } from 'lucide-react';

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

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'offline'>('idle');
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

    if (!navigator.onLine) {
      await enqueueOfflineLog(logPayload);
      setSaveStatus('offline');
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
        if (onSaveSuccess) onSaveSuccess(data.log);
      } else {
        await enqueueOfflineLog(logPayload);
        setSaveStatus('offline');
      }
    } catch {
      await enqueueOfflineLog(logPayload);
      setSaveStatus('offline');
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
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          บันทึกผลประจำวัน (วัน {day})
        </h3>
        <div className="flex items-center gap-1 text-xs">
          {saveStatus === 'saving' && (
            <span className="text-slate-400 flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cobalt-500" />
              กำลังบันทึก...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-500 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              บันทึกแล้ว
            </span>
          )}
          {saveStatus === 'offline' && (
            <span className="text-amber-500 flex items-center gap-1 font-medium">
              รอซิงค์เมื่อออนไลน์
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Morning Weight */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            น้ำหนักเช้า (กก.) *
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="เช่น 78.5"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Waist */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            รอบเอว (ซม.) [ถ้ามี]
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="เช่น 82.0"
            value={waistCm}
            onChange={(e) => setWaistCm(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Protein */}
        <div>
          <label className="block text-xs font-medium text-cobalt-600 dark:text-cobalt-400 mb-1">
            โปรตีน (กรัม)
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={proteinG}
            onChange={(e) => setProteinG(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Carb */}
        <div>
          <label className="block text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
            คาร์โบไฮเดรต (กรัม)
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={carbG}
            onChange={(e) => setCarbG(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Fat */}
        <div>
          <label className="block text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">
            ไขมัน (กรัม)
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={fatG}
            onChange={(e) => setFatG(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Manual Save button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={saveLog}
            className="w-full h-[42px] rounded-xl bg-cobalt-600 hover:bg-cobalt-700 active:scale-95 text-white font-medium text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>บันทึก</span>
          </button>
        </div>
      </div>
    </div>
  );
}
