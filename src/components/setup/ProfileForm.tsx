'use client';

import { useState } from 'react';
import { UserProfile, ActivityLevel, Sex } from '@/lib/plan';
import { Save, AlertTriangle, RefreshCw, Check } from 'lucide-react';
import clsx from 'clsx';

interface ProfileFormProps {
  profile: UserProfile;
  onProfileUpdated: (newProfile: UserProfile) => void;
  onRecalibrate: () => void;
  onClearRecalibrate: () => void;
}

export function ProfileForm({
  profile,
  onProfileUpdated,
  onRecalibrate,
  onClearRecalibrate,
}: ProfileFormProps) {
  const [sex, setSex] = useState<Sex>(profile.sex);
  const [age, setAge] = useState<number>(profile.age);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm);
  const [startWeightKg, setStartWeightKg] = useState<number>(profile.startWeightKg);
  const [goalWeightKg, setGoalWeightKg] = useState<number>(profile.goalWeightKg);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [startDate, setStartDate] = useState<string>(profile.startDate);
  const [proteinGPerKg, setProteinGPerKg] = useState<number>(profile.proteinGPerKg ?? 2.1);
  const [fatGPerKg, setFatGPerKg] = useState<number>(profile.fatGPerKg ?? 0.8);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const updatedData = {
      sex,
      age: Number(age),
      heightCm: Number(heightCm),
      startWeight: Number(startWeightKg),
      goalWeight: Number(goalWeightKg),
      activity: activityLevel,
      startDate,
      proteinGPerKg: Number(proteinGPerKg),
      fatGPerKg: Number(fatGPerKg),
      recalDay: profile.recalDay ?? null,
      recalWeight: profile.recalWeightKg ?? null,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว');
        onProfileUpdated({
          sex: data.profile.sex,
          age: data.profile.age,
          heightCm: data.profile.heightCm,
          startWeightKg: data.profile.startWeight,
          goalWeightKg: data.profile.goalWeight,
          activityLevel: data.profile.activity,
          startDate: data.profile.startDate,
          proteinGPerKg: data.profile.proteinGPerKg,
          fatGPerKg: data.profile.fatGPerKg,
          recalDay: data.profile.recalDay,
          recalWeightKg: data.profile.recalWeight,
        });
      } else {
        const err = await res.json();
        setMessage(err.error?.message || 'เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          แก้ไขข้อมูลร่างกายและเป้าหมาย
        </h3>

        {profile.recalDay && (
          <button
            type="button"
            onClick={onClearRecalibrate}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium underline"
          >
            ยกเลิกการปรับแผน
          </button>
        )}
      </div>

      {message && (
        <div
          className={clsx(
            'p-3 rounded-xl text-xs font-medium flex items-center gap-2',
            message.includes('เรียบร้อย')
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
          )}
        >
          {message.includes('เรียบร้อย') ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sex */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            เพศ
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSex('male')}
              className={clsx(
                'py-2.5 rounded-xl border text-sm font-medium transition-colors',
                sex === 'male'
                  ? 'bg-cobalt-600 text-white border-cobalt-600'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              ชาย (Male)
            </button>
            <button
              type="button"
              onClick={() => setSex('female')}
              className={clsx(
                'py-2.5 rounded-xl border text-sm font-medium transition-colors',
                sex === 'female'
                  ? 'bg-cobalt-600 text-white border-cobalt-600'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              หญิง (Female)
            </button>
          </div>
        </div>

        {/* Age, Height */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              อายุ (ปี)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              ส่วนสูง (ซม.)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Start Weight, Goal Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              น้ำหนักเริ่มต้น (กก.)
            </label>
            <input
              type="number"
              step="0.1"
              value={startWeightKg}
              onChange={(e) => setStartWeightKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              น้ำหนักเป้าหมาย (กก.)
            </label>
            <input
              type="number"
              step="0.1"
              value={goalWeightKg}
              onChange={(e) => setGoalWeightKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            ระดับกิจกรรมประจำวัน
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
          >
            <option value="sedentary">นั่งทำงานอยู่กับที่ ไม่ค่อยออกกำลังกาย (x1.2)</option>
            <option value="lightly">ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์ (x1.375)</option>
            <option value="moderately">ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์ (x1.55)</option>
            <option value="very">ออกกำลังกายหนัก 6-7 วัน/สัปดาห์ (x1.725)</option>
            <option value="extremely">นักกีฬา / ทำงานใช้แรงงานหนักมาก (x1.9)</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            วันที่เริ่มแผน (YYYY-MM-DD)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        {/* Macros G/Kg */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-cobalt-600 dark:text-cobalt-400 mb-1">
              โปรตีน (g/น้ำหนักตัว kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={proteinGPerKg}
              onChange={(e) => setProteinGPerKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">
              ไขมัน (g/น้ำหนักตัว kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={fatGPerKg}
              onChange={(e) => setFatGPerKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:flex-1 h-11 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
          </button>

          <button
            type="button"
            onClick={onRecalibrate}
            className="w-full sm:w-auto h-11 px-4 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-medium text-sm flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ปรับคำนวณแผนใหม่</span>
          </button>
        </div>
      </form>
    </div>
  );
}
