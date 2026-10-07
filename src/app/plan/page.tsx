'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { PlanTable } from '@/components/plan/PlanTable';
import {
  calculatePlan,
  DailyLogInput,
  getDayForDate,
  getTodayStr,
  PlanDay,
  UserProfile,
} from '@/lib/plan';
import { Loader2 } from 'lucide-react';

export default function PlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [logs, setLogs] = useState<DailyLogInput[]>([]);
  const [todayDayNumber, setTodayDayNumber] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
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

        const logsRes = await fetch('/api/logs');
        const logsData = logsRes.ok ? await logsRes.json() : { logs: [] };

        const plan = calculatePlan(userProf);
        setPlanDays(plan);
        setLogs(logsData.logs || []);

        const todayStr = getTodayStr();
        const calculatedToday = getDayForDate(userProf.startDate, todayStr);
        setTodayDayNumber(calculatedToday);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading || planDays.length === 0) {
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
        <div className="flex items-center justify-between">
          <h1 className="font-brand font-bold text-2xl uppercase tracking-wider text-slate-900 dark:text-white">
            แผนผัง 90 วัน
          </h1>
          <span className="text-xs text-slate-500 font-mono">
            เขียว = ±10% | ส้ม = เกิน/ขาด
          </span>
        </div>

        <PlanTable
          planDays={planDays}
          logs={logs}
          todayDayNumber={todayDayNumber}
        />
      </main>

      <BottomNav />
    </div>
  );
}
