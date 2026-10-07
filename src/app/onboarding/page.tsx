'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTodayStr, ActivityLevel, Sex } from '@/lib/plan';
import { Flame, ArrowRight, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function OnboardingPage() {
  const router = useRouter();

  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState<number>(30);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [startWeight, setStartWeight] = useState<number>(79.3);
  const [goalWeight, setGoalWeight] = useState<number>(69.5);
  const [activity, setActivity] = useState<ActivityLevel>('moderately');
  const [startDate, setStartDate] = useState<string>(getTodayStr());

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      sex,
      age: Number(age),
      heightCm: Number(heightCm),
      startWeight: Number(startWeight),
      goalWeight: Number(goalWeight),
      activity,
      startDate,
      proteinGPerKg: 2.1,
      fatGPerKg: 0.8,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error?.message || 'เกิดข้อผิดพลาดในการสร้างโปรไฟล์');
      }
    } catch {
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1319] py-8 px-4 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cobalt-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Flame className="w-7 h-7 fill-current text-amber-300" />
          </div>
          <h1 className="font-brand font-bold text-2xl uppercase tracking-wider text-slate-900 dark:text-white">
            ตั้งค่าแผน 90 วันของคุณ
          </h1>
          <p className="text-xs text-slate-500">
            กรอกข้อมูลเพื่อคำนวณ BMR, TDEE และเป้าหมายโภชนาการรายวัน
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
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
                    'py-2.5 rounded-xl border text-sm font-medium transition-all',
                    sex === 'male'
                      ? 'bg-cobalt-600 text-white border-cobalt-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  ชาย (Male)
                </button>
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  className={clsx(
                    'py-2.5 rounded-xl border text-sm font-medium transition-all',
                    sex === 'female'
                      ? 'bg-cobalt-600 text-white border-cobalt-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  หญิง (Female)
                </button>
              </div>
            </div>

            {/* Age & Height */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  อายุ (ปี)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  min={10}
                  max={120}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
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
                  required
                  min={100}
                  max={250}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Start & Goal Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  น้ำหนักเริ่ม (กก.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={startWeight}
                  onChange={(e) => setStartWeight(Number(e.target.value))}
                  required
                  min={30}
                  max={300}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  น้ำหนักเป้าหมาย (กก.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(Number(e.target.value))}
                  required
                  min={30}
                  max={300}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                ระดับกิจกรรมประจำวัน
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
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
                required
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'กำลังสร้างแผน...' : 'สร้างแผน 90 วันเลย'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
