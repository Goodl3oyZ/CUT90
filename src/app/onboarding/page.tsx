'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTodayStr, ActivityLevel, Sex, calculatePlan, calculatePlanSummary, UserProfile } from '@/lib/plan';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import clsx from 'clsx';

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState<number>(30);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [startWeight, setStartWeight] = useState<number>(79.3);
  const [goalWeight, setGoalWeight] = useState<number>(69.5);
  const [activity, setActivity] = useState<ActivityLevel>('moderately');
  const [startDate, setStartDate] = useState<string>(getTodayStr());
  const [proteinGPerKg, setProteinGPerKg] = useState<number>(2.1);
  const [fatGPerKg, setFatGPerKg] = useState<number>(0.8);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Temporary UserProfile to calculate preview summary
  const tempProfile: UserProfile = {
    sex,
    age: Number(age) || 30,
    heightCm: Number(heightCm) || 175,
    startWeightKg: Number(startWeight) || 75,
    goalWeightKg: Number(goalWeight) || 68,
    activityLevel: activity,
    startDate,
    proteinGPerKg: Number(proteinGPerKg) || 2.1,
    fatGPerKg: Number(fatGPerKg) || 0.8,
  };

  const previewPlanDays = calculatePlan(tempProfile);
  const previewSummary = calculatePlanSummary(tempProfile, previewPlanDays);

  const handleFinalSubmit = async () => {
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
      proteinGPerKg: Number(proteinGPerKg),
      fatGPerKg: Number(fatGPerKg),
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
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 px-4 flex flex-col justify-center items-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brass-400 text-obsidian-950 flex items-center justify-center mx-auto shadow-brass-glow">
            <Icon name="Flame" size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl uppercase tracking-wider text-[var(--text-primary)]">
            ตั้งค่าแผน 90 วันของคุณ
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            ขั้นตอนที่ {step} จาก 4: {step === 1 ? 'ข้อมูลกายภาพ' : step === 2 ? 'เป้าหมายร่างกาย' : step === 3 ? 'โภชนาการ' : 'พรีวิวคำนวณแผน'}
          </p>

          <button
            type="button"
            onClick={() => setShowHowItWorks(true)}
            className="inline-flex items-center gap-1.5 text-xs text-brass-400 hover:underline pt-1 font-medium"
          >
            <Icon name="CircleHelp" size={14} />
            <span>อ่านคำอธิบาย "หลักการทำงานของแผน Cut 90"</span>
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={clsx(
                'h-1.5 rounded-full transition-all duration-300',
                step >= s ? 'bg-brass-400' : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]'
              )}
            />
          ))}
        </div>

        {/* Card Content */}
        <Card variant="default" padding="lg" className="space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <Icon name="AlertCircle" size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-wider">
                ขั้นตอนที่ 1: ข้อมูลเกี่ยวกับคุณ
              </h2>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  <Icon name="UserRound" size={14} className="text-brass-400" />
                  <span>เพศชีววิทยา</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => setSex('male')}
                    variant={sex === 'male' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    ชาย (Male)
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setSex('female')}
                    variant={sex === 'female' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    หญิง (Female)
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="อายุ"
                  unit="ปี"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={10}
                  max={120}
                  required
                />

                <Field
                  label="ส่วนสูง"
                  unit="ซม."
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  min={100}
                  max={250}
                  required
                />
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                variant="primary"
                size="md"
                fullWidth
                rightIcon={<Icon name="ArrowRight" size={16} />}
              >
                ถัดไป: ตั้งเป้าหมาย
              </Button>
            </div>
          )}

          {/* STEP 2: BODY & GOAL */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-wider">
                ขั้นตอนที่ 2: ร่างกายและเป้าหมาย
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="น้ำหนักเริ่มต้น"
                  unit="กก."
                  type="number"
                  step="0.1"
                  value={startWeight}
                  onChange={(e) => setStartWeight(Number(e.target.value))}
                  required
                />

                <Field
                  label="น้ำหนักเป้าหมาย"
                  unit="กก."
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(Number(e.target.value))}
                  required
                />
              </div>

              <Select
                label="ระดับกิจกรรมประจำวัน"
                icon="Compass"
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                options={[
                  { value: 'sedentary', label: 'นั่งทำงานอยู่กับที่ ไม่ค่อยออกกำลังกาย (x1.2)' },
                  { value: 'lightly', label: 'ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์ (x1.375)' },
                  { value: 'moderately', label: 'ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์ (x1.55)' },
                  { value: 'very', label: 'ออกกำลังกายหนัก 6-7 วัน/สัปดาห์ (x1.725)' },
                  { value: 'extremely', label: 'นักกีฬา / ทำงานใช้แรงงานหนักมาก (x1.9)' },
                ]}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<Icon name="ArrowRight" size={16} />}
                >
                  ถัดไป: โภชนาการ
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: NUTRITION & START DATE */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-wider">
                ขั้นตอนที่ 3: สัดส่วนสารอาหารและวันเริ่ม
              </h2>

              <Field
                label="วันที่เริ่มแผน 90 วัน"
                icon="Calendar"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="โปรตีนเป้าหมาย"
                  unit="g/kg"
                  type="number"
                  step="0.1"
                  value={proteinGPerKg}
                  onChange={(e) => setProteinGPerKg(Number(e.target.value))}
                  helperText="ค่ามาตรฐาน 2.1 g/kg"
                />

                <Field
                  label="ไขมันเป้าหมาย"
                  unit="g/kg"
                  type="number"
                  step="0.1"
                  value={fatGPerKg}
                  onChange={(e) => setFatGPerKg(Number(e.target.value))}
                  helperText="ค่ามาตรฐาน 0.8 g/kg"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(4)}
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<Icon name="Compass" size={16} />}
                >
                  ถัดไป: ดูพรีวิวแผน
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PLAN PREVIEW & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-wider">
                ขั้นตอนที่ 4: พรีวิวและยืนยันแผนผัง
              </h2>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-3 text-xs tabular-nums">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                  <span className="text-[var(--text-secondary)]">BMR / TDEE คำนวณได้</span>
                  <span className="font-mono font-bold text-brass-400">
                    {previewSummary.bmrStart} / {previewSummary.tdeeStart} kcal
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                  <span className="text-[var(--text-secondary)]">เป้าหมายแคลอรี่ วันที่ 1 → 90</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">
                    {previewSummary.kcalDay1} → {previewSummary.kcalDay90} kcal
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">อัตราการลดเป้าหมายรายสัปดาห์</span>
                  <span className="font-mono font-bold text-emerald-500">
                    {previewSummary.weeklyDropKg} kg ({previewSummary.weeklyDropPercentBw}%/wk)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  แก้ไขข้อมูล
                </Button>

                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  isLoading={loading}
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={<Icon name="Check" size={16} />}
                >
                  ยืนยันสร้างแผน 90 วัน
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* How It Works Sheet */}
        <Sheet
          isOpen={showHowItWorks}
          onClose={() => setShowHowItWorks(false)}
          title="คู่มือหลักการทำงานของแผน Cut 90"
          subtitle="ทำไมระบบถึงให้ผลลัพธ์แม่นยำกว่าแอปนับแคลอรี่ทั่วไป"
        >
          <div className="space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed">
            <div className="space-y-1">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Icon name="Compass" size={14} className="text-brass-400" />
                <span>1. แผนผังปรับลดพลังงานตามน้ำหนักตัว (Dynamic Deficit)</span>
              </h3>
              <p>
                เมื่อน้ำหนักลดลง อัตรา BMR และ TDEE ของร่างกายจะปรับลดลงตามธรรมชาติ ระบบ Cut 90 จึงปรับลดเป้าแคลอรี่ทีละน้อยในทุกวันเพื่อป้องกันน้ำหนักนิ่ง (Plateau)
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Icon name="LineChart" size={14} className="text-brass-400" />
                <span>2. ติดตามค่าเฉลี่ย 7 วัน ไม่ตระหนกกับน้ำหนักรายวัน</span>
              </h3>
              <p>
                น้ำหนักตัวผันผวนได้ 0.5 - 1.5 กก. จากปริมาณโซเดียม แป้ง คาร์บ และน้ำในร่างกาย การตัดสินผลใช้ค่าเฉลี่ยย้อนหลัง 7 วันเพื่อหาแนวโน้มไขมันที่แท้จริง
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Icon name="RefreshCw" size={14} className="text-brass-400" />
                <span>3. การ Recalibrate เมื่อหลุดแผน</span>
              </h3>
              <p>
                หากน้ำหนักเฉลี่ยช้ากว่าแผนหรือเร็วกว่าแผนเกินกำหนด ปุ่ม Recalibrate ในหน้าตั้งค่าจะช่วยคำนวณปรับจุดเริ่มต้นใหม่ทันทีโดยไม่ต้องเริ่มนับหนึ่งใหม่
              </p>
            </div>
          </div>
        </Sheet>
      </div>
    </div>
  );
}
