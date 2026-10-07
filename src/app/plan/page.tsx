'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { NavLayout } from '@/components/ui/NavLayout';
import { PlanTable } from '@/components/plan/PlanTable';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/Icon';
import {
  calculatePlan,
  DailyLogInput,
  getDayForDate,
  getTodayStr,
  PlanDay,
  UserProfile,
} from '@/lib/plan';

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
      <NavLayout>
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="card" className="h-96" />
        </main>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4">
          <div>
            <h1 className="font-display font-bold text-2xl uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Icon name="LayoutGrid" size={24} className="text-brass-400" />
              <span>ตารางแผนผัง 90 วัน (Plan Schedule)</span>
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              แผนคำนวณโภชนาการรายวัน ปรับลดอย่างเป็นระบบตามอัตราการผลาญไขมัน
            </p>
          </div>
        </div>

        <PlanTable
          planDays={planDays}
          logs={logs}
          todayDayNumber={todayDayNumber}
        />
      </main>
    </NavLayout>
  );
}
