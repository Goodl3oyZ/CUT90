'use client';

import { useState } from 'react';
import { UserProfile, ActivityLevel, Sex } from '@/lib/plan';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Popover } from '@/components/ui/Popover';
import { Sheet } from '@/components/ui/Sheet';
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
  const [showRecalibrateSheet, setShowRecalibrateSheet] = useState(false);

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
    <Card variant="default" padding="md" className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={18} className="text-brass-400" />
            <span>แก้ไขข้อมูลร่างกายและเป้าหมาย</span>
          </h2>
          <Popover
            title="การตั้งค่าโปรไฟล์"
            description="ค่าส่วนสูง เพศ อายุ และระดับกิจกรรมใช้ในการคำนวณอัตราการเผาผลาญพื้นฐาน (BMR/TDEE) แบบวิทยาศาสตร์"
            glossaryAnchor="bmr"
          />
        </div>

        {profile.recalDay && (
          <Button
            type="button"
            onClick={onClearRecalibrate}
            variant="ghost"
            size="sm"
            className="text-amber-500 hover:text-amber-400 text-xs"
          >
            ยกเลิกการปรับแผน
          </Button>
        )}
      </div>

      {message && (
        <div
          className={clsx(
            'p-3.5 rounded-xl text-xs font-medium flex items-center gap-2',
            message.includes('เรียบร้อย')
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
          )}
        >
          <Icon name={message.includes('เรียบร้อย') ? 'Check' : 'AlertCircle'} size={16} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sex */}
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

        {/* Age, Height */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="อายุ"
            unit="ปี"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <Field
            label="ส่วนสูง"
            unit="ซม."
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
          />
        </div>

        {/* Start Weight, Goal Weight */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="น้ำหนักเริ่มต้น"
            unit="กก."
            type="number"
            step="0.1"
            value={startWeightKg}
            onChange={(e) => setStartWeightKg(Number(e.target.value))}
          />
          <Field
            label="น้ำหนักเป้าหมาย"
            unit="กก."
            type="number"
            step="0.1"
            value={goalWeightKg}
            onChange={(e) => setGoalWeightKg(Number(e.target.value))}
          />
        </div>

        {/* Activity Level */}
        <Select
          label="ระดับกิจกรรมประจำวัน"
          icon="Compass"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          options={[
            { value: 'sedentary', label: 'นั่งทำงานอยู่กับที่ ไม่ค่อยออกกำลังกาย (x1.2)' },
            { value: 'lightly', label: 'ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์ (x1.375)' },
            { value: 'moderately', label: 'ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์ (x1.55)' },
            { value: 'very', label: 'ออกกำลังกายหนัก 6-7 วัน/สัปดาห์ (x1.725)' },
            { value: 'extremely', label: 'นักกีฬา / ทำงานใช้แรงงานหนักมาก (x1.9)' },
          ]}
        />

        {/* Start Date */}
        <Field
          label="วันที่เริ่มแผน 90 วัน"
          icon="Calendar"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* Macros G/Kg */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Field
            label="โปรตีน"
            unit="g/kg"
            type="number"
            step="0.1"
            value={proteinGPerKg}
            onChange={(e) => setProteinGPerKg(Number(e.target.value))}
            helperText="แนะนำ 2.0 - 2.4 g/kg"
          />
          <Field
            label="ไขมัน"
            unit="g/kg"
            type="number"
            step="0.1"
            value={fatGPerKg}
            onChange={(e) => setFatGPerKg(Number(e.target.value))}
            helperText="แนะนำ 0.7 - 0.9 g/kg"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[var(--border-color)]">
          <Button
            type="submit"
            isLoading={saving}
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<Icon name="Save" size={16} />}
          >
            บันทึกการเปลี่ยนแปลง
          </Button>

          <Button
            type="button"
            onClick={() => setShowRecalibrateSheet(true)}
            variant="secondary"
            size="md"
            fullWidth
            leftIcon={<Icon name="RefreshCw" size={16} className="text-amber-500" />}
          >
            ปรับคำนวณแผนใหม่ (Recalibrate)
          </Button>
        </div>
      </form>

      {/* Recalibrate Confirmation Sheet */}
      <Sheet
        isOpen={showRecalibrateSheet}
        onClose={() => setShowRecalibrateSheet(false)}
        title="ยืนยันการปรับคำนวณแผนใหม่ (Recalibrate)"
        subtitle="ใช้เมื่อน้ำหนักจริงเฉลี่ยย้อนหลังเบี่ยงเบนจากแผนเกินกำหนด"
      >
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            ระบบจะนำค่าน้ำหนักเฉลี่ย 7 วันล่าสุด ณ ปัจจุบัน มาตั้งเป็นจุดเริ่มต้นคำนวณแผนโภชนาการสำหรับวันที่เหลืออยู่ เพื่อให้ตรงตามอัตราเผาผลาญจริงของร่างกาย
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setShowRecalibrateSheet(false)}
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<Icon name="RefreshCw" size={16} />}
              onClick={() => {
                setShowRecalibrateSheet(false);
                onRecalibrate();
              }}
            >
              ยืนยันการปรับแผน
            </Button>
          </div>
        </div>
      </Sheet>
    </Card>
  );
}
