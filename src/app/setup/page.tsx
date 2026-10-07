'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { NavLayout } from '@/components/ui/NavLayout';
import { ProfileForm } from '@/components/setup/ProfileForm';
import { DataSection } from '@/components/setup/DataSection';
import { AccountSection } from '@/components/setup/AccountSection';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/Icon';
import { Popover } from '@/components/ui/Popover';
import {
  calculatePlan,
  calculatePlanSummary,
  calculateWarnings,
  clearRecalibration,
  DailyLogInput,
  getDayForDate,
  getTodayStr,
  PlanDay,
  PlanSummary,
  PlanWarnings,
  recalibrateProfile,
  UserProfile,
} from '@/lib/plan';
import Link from 'next/link';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [logs, setLogs] = useState<DailyLogInput[]>([]);
  const [summary, setSummary] = useState<PlanSummary | null>(null);
  const [warnings, setWarnings] = useState<PlanWarnings | null>(null);

  const loadData = useCallback(async () => {
    try {
      const profRes = await fetch('/api/profile');
      if (profRes.status === 401) {
        router.push('/login');
        return;
      }

      const profData = await profRes.json();
      if (!profData.profile) {
        router.push('/onboarding');
        return;
      }

      const userProf: UserProfile = {
        sex: profData.profile.sex,
        age: profData.profile.age,
        heightCm: profData.profile.heightCm,
        startWeightKg: profData.profile.startWeight,
        goalWeightKg: profData.profile.goalWeight,
        activityLevel: profData.profile.activity,
        startDate: profData.profile.startDate,
        proteinGPerKg: profData.profile.proteinGPerKg,
        fatGPerKg: profData.profile.fatGPerKg,
        recalDay: profData.profile.recalDay,
        recalWeightKg: profData.profile.recalWeight,
      };

      setProfile(userProf);

      const logsRes = await fetch('/api/logs');
      const logsData = logsRes.ok ? await logsRes.json() : { logs: [] };
      const loadedLogs: DailyLogInput[] = logsData.logs || [];
      setLogs(loadedLogs);

      const plan = calculatePlan(userProf);
      setPlanDays(plan);

      const planSum = calculatePlanSummary(userProf, plan);
      setSummary(planSum);

      const warn = calculateWarnings(userProf, plan);
      setWarnings(warn);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProfileUpdated = (newProf: UserProfile) => {
    setProfile(newProf);
    const plan = calculatePlan(newProf);
    setPlanDays(plan);
    setSummary(calculatePlanSummary(newProf, plan));
    setWarnings(calculateWarnings(newProf, plan));
  };

  const handleRecalibrate = async () => {
    if (!profile) return;
    const todayStr = getTodayStr();
    const currentDay = getDayForDate(profile.startDate, todayStr) ?? 1;

    const recalProf = recalibrateProfile(profile, currentDay, logs);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sex: recalProf.sex,
          age: recalProf.age,
          heightCm: recalProf.heightCm,
          startWeight: recalProf.startWeightKg,
          goalWeight: recalProf.goalWeightKg,
          activity: recalProf.activityLevel,
          startDate: recalProf.startDate,
          proteinGPerKg: recalProf.proteinGPerKg,
          fatGPerKg: recalProf.fatGPerKg,
          recalDay: recalProf.recalDay,
          recalWeight: recalProf.recalWeightKg,
        }),
      });

      if (res.ok) {
        handleProfileUpdated(recalProf);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearRecalibrate = async () => {
    if (!profile) return;
    const clearedProf = clearRecalibration(profile);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sex: clearedProf.sex,
          age: clearedProf.age,
          heightCm: clearedProf.heightCm,
          startWeight: clearedProf.startWeightKg,
          goalWeight: clearedProf.goalWeightKg,
          activity: clearedProf.activityLevel,
          startDate: clearedProf.startDate,
          proteinGPerKg: clearedProf.proteinGPerKg,
          fatGPerKg: clearedProf.fatGPerKg,
          recalDay: null,
          recalWeight: null,
        }),
      });

      if (res.ok) {
        handleProfileUpdated(clearedProf);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !profile || !summary || !warnings) {
    return (
      <NavLayout>
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="card" className="h-48" />
        </main>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <div className="border-b border-[var(--border-color)] pb-4">
          <h1 className="font-display font-bold text-2xl uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={24} className="text-brass-400" />
            <span>ตั้งค่าและภาพรวมแผนผัง (Plan Setup)</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            ปรับแต่งค่าทางกายภาพ ตรวจสอบการแจ้งเตือนความปลอดภัย สำรองข้อมูล และจัดการบัญชี
          </p>
        </div>

        {/* Plan Summary Card */}
        <Card variant="default" padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
              <Icon name="Flame" size={18} className="text-brass-400" />
              <span>สรุปแผนพลังงาน 90 วัน</span>
            </h2>
            <span className="text-xs font-mono text-brass-400 font-semibold">
              Mifflin-St Jeor Formula
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs tabular-nums">
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>BMR เริ่มต้น</span>
                <Popover
                  title="BMR (Basal Metabolic Rate)"
                  description="พลังงานขั้นต่ำที่ร่างกายใช้เพื่อการมีชีวิตรอดในแต่ละวันขณะพัก"
                  glossaryAnchor="bmr"
                />
              </div>
              <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
                {summary.bmrStart} kcal
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>TDEE เริ่มต้น</span>
                <Popover
                  title="TDEE (Total Daily Energy Expenditure)"
                  description="พลังงานที่เผาผลาญรวมทั้งหมดต่อวัน รวมกิจกรรมและการทำชีวิตประจำวัน"
                  glossaryAnchor="tdee"
                />
              </div>
              <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
                {summary.tdeeStart} kcal
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>แคลอรี่ วันที่ 1 → 90</span>
                <Popover
                  title="Deficit & Step Down"
                  description="ปริมาณพลังงานที่รับประทานจะค่อยๆ ลดลงตามน้ำหนักตัวที่ลดลงเพื่อรักษา Deficit"
                  glossaryAnchor="deficit"
                />
              </div>
              <div className="font-mono text-base font-bold text-brass-400">
                {summary.kcalDay1} → {summary.kcalDay90} kcal
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>อัตราลด/สัปดาห์</span>
                <Popover
                  title="Weekly Rate"
                  description="อัตราการลดน้ำหนักที่ปลอดภัยที่สุดอยู่ระหว่าง 0.5% - 1.0% ของน้ำหนักตัวต่อสัปดาห์"
                  glossaryAnchor="weekly-rate"
                />
              </div>
              <div className="font-mono text-base font-bold text-emerald-500">
                {summary.weeklyDropKg} kg ({summary.weeklyDropPercentBw}%)
              </div>
            </div>
          </div>
        </Card>

        {/* Warnings Card */}
        {(warnings.isAggressive || warnings.isNearCeiling || warnings.isFloorHit) && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-2 text-amber-700 dark:text-amber-300">
            <div className="font-bold flex items-center gap-2 uppercase tracking-wide text-sm">
              <Icon name="AlertTriangle" size={16} className="text-amber-500" />
              <span>คำเตือนประเมินความปลอดภัยของแผน</span>
            </div>

            {warnings.isAggressive && (
              <p className="flex items-start gap-1.5">
                <span>•</span>
                <span>แผนนี้ตั้งอัตราลดน้ำหนักเร็วกว่า 1.0% ของน้ำหนักตัว/สัปดาห์ เสี่ยงต่อการสูญเสียมวลกล้ามเนื้อและระบบเผาผลาญปรับตัวลงแรง</span>
              </p>
            )}
            {warnings.isNearCeiling && (
              <p className="flex items-start gap-1.5">
                <span>•</span>
                <span>อัตราลดน้ำหนักอยู่ใกล้เพดานความปลอดภัย (0.75% - 1.0% ของน้ำหนักตัว/สัปดาห์)</span>
              </p>
            )}
            {warnings.isFloorHit && (
              <p className="flex items-start gap-1.5">
                <span>•</span>
                <span>แคลอรี่ลดลงจนแตะระดับขั้นต่ำเพื่อความปลอดภัย (BMR Floor) แนะนำให้ขยายระยะเวลาแผนเพิ่มเติม</span>
              </p>
            )}
          </div>
        )}

        {/* Edit Profile Form */}
        <ProfileForm
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
          onRecalibrate={handleRecalibrate}
          onClearRecalibrate={handleClearRecalibrate}
        />

        {/* Data Import/Export */}
        <DataSection />

        {/* Account Security */}
        <AccountSection />

        {/* Help & Privacy Navigation Links */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs">
          <Link
            href="/help"
            className="text-[var(--text-secondary)] hover:text-brass-400 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Icon name="CircleHelp" size={15} />
            <span>ศูนย์ช่วยเหลือ & คำถามที่พบบ่อย (Help Center)</span>
          </Link>
          <span className="text-[var(--border-color)]">|</span>
          <Link
            href="/privacy"
            className="text-[var(--text-secondary)] hover:text-brass-400 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Icon name="ShieldCheck" size={15} />
            <span>นโยบายความเป็นส่วนตัว (Privacy Policy)</span>
          </Link>
        </div>
      </main>
    </NavLayout>
  );
}
