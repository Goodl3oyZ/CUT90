'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ProfileForm } from '@/components/setup/ProfileForm';
import { DataSection } from '@/components/setup/DataSection';
import { AccountSection } from '@/components/setup/AccountSection';
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
import { Loader2, AlertTriangle, ShieldCheck, Flame, Scale, FileText } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1319] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cobalt-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-[#0b1319]">
      <Header />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        <h1 className="font-brand font-bold text-2xl uppercase tracking-wider text-slate-900 dark:text-white">
          ตั้งค่าและภาพรวมแผน
        </h1>

        {/* Plan Summary Card */}
        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-cobalt-500" />
            <span>สรุปแผนพลังงาน 90 วัน</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs tabular-nums">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400">BMR เริ่มต้น</div>
              <div className="font-brand text-lg font-bold text-slate-900 dark:text-white">
                {summary.bmrStart} kcal
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400">TDEE เริ่มต้น</div>
              <div className="font-brand text-lg font-bold text-slate-900 dark:text-white">
                {summary.tdeeStart} kcal
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400">แคลอรี่วันแรก → วันสุดท้าย</div>
              <div className="font-brand text-base font-bold text-cobalt-600 dark:text-cobalt-400">
                {summary.kcalDay1} → {summary.kcalDay90} kcal
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400">อัตราลดรายสัปดาห์</div>
              <div className="font-brand text-base font-bold text-emerald-600 dark:text-emerald-400">
                {summary.weeklyDropKg} kg ({summary.weeklyDropPercentBw}%/wk)
              </div>
            </div>
          </div>
        </div>

        {/* Warnings Card */}
        {(warnings.isAggressive || warnings.isNearCeiling || warnings.isFloorHit) && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs space-y-2 text-amber-800 dark:text-amber-300">
            <div className="font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>คำเตือนข้อควรระวังของแผน</span>
            </div>

            {warnings.isAggressive && (
              <p>
                • แผนนี้ลดน้ำหนักเร็วกว่า 1.0% ของน้ำหนักตัว/สัปดาห์ (เสี่ยงต่อการสูญเสียมวลกล้ามเนื้อ)
              </p>
            )}
            {warnings.isNearCeiling && (
              <p>
                • อัตราลดน้ำหนักอยู่ใกล้เพดานความปลอดภัย (0.75% - 1.0% ของน้ำหนักตัว/สัปดาห์)
              </p>
            )}
            {warnings.isFloorHit && (
              <p>
                • แคลอรี่ลดแตะระดับขั้นต่ำความปลอดภัย (Floor Hit) แนะนำให้ขยายระยะเวลาแผนเพิ่มเติม
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

        {/* Privacy Policy Link */}
        <div className="text-center pt-2">
          <Link
            href="/privacy"
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>นโยบายความเป็นส่วนตัว (Privacy Policy)</span>
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
