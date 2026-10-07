'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { WeightChart } from '@/components/trend/WeightChart';
import { WeeklyTable } from '@/components/trend/WeeklyTable';
import {
  calculatePlan,
  calculatePlanSummary,
  DailyLogInput,
  getDayForDate,
  getTodayStr,
  PlanDay,
  PlanSummary,
  UserProfile,
} from '@/lib/plan';
import { Loader2, TrendingDown, Flame, Calendar, Scale } from 'lucide-react';

export default function TrendPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [logs, setLogs] = useState<DailyLogInput[]>([]);
  const [summary, setSummary] = useState<PlanSummary | null>(null);
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

        setProfile(userProf);

        const logsRes = await fetch('/api/logs');
        const logsData = logsRes.ok ? await logsRes.json() : { logs: [] };
        const loadedLogs: DailyLogInput[] = logsData.logs || [];
        setLogs(loadedLogs);

        const plan = calculatePlan(userProf);
        setPlanDays(plan);

        const planSum = calculatePlanSummary(userProf, plan);
        setSummary(planSum);

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

  if (loading || !profile || !summary || planDays.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1319] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cobalt-600" />
      </div>
    );
  }

  // Calculate actual total weight drop logged so far
  const validWeightLogs = logs
    .filter((l) => typeof l.weightKg === 'number' && l.weightKg > 0)
    .sort((a, b) => a.day - b.day);

  const firstLoggedWeight = validWeightLogs[0]?.weightKg ?? profile.startWeightKg;
  const latestLoggedWeight =
    validWeightLogs[validWeightLogs.length - 1]?.weightKg ?? profile.startWeightKg;
  const actualTotalDrop = Math.round((firstLoggedWeight - latestLoggedWeight) * 10) / 10;

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-[#0b1319]">
      <Header />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        <h1 className="font-brand font-bold text-2xl uppercase tracking-wider text-slate-900 dark:text-white">
          แนวโน้มและความคืบหน้า
        </h1>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase">
              <Scale className="w-3.5 h-3.5 text-cobalt-500" />
              <span>น้ำหนักที่ลดได้จริง</span>
            </div>
            <div className="font-brand text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {actualTotalDrop > 0 ? `-${actualTotalDrop.toFixed(1)}` : '0.0'}{' '}
              <span className="text-sm text-slate-500 font-normal">กก.</span>
            </div>
            <p className="text-[11px] text-slate-400">
              เป้าหมายลดทั้งหมด {summary.totalPlannedDropKg} กก.
            </p>
          </div>

          <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>พรวดแคลอรี่เฉลี่ย</span>
            </div>
            <div className="font-brand text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              -{summary.avgDailyDeficit}{' '}
              <span className="text-sm text-slate-500 font-normal">kcal/วัน</span>
            </div>
            <p className="text-[11px] text-slate-400">
              ~{summary.weeklyDropKg} กก./สัปดาห์ ({summary.weeklyDropPercentBw}%)
            </p>
          </div>
        </div>

        {/* SVG Weight Line Chart */}
        <WeightChart
          planDays={planDays}
          logs={logs}
          goalWeightKg={profile.goalWeightKg}
          todayDayNumber={todayDayNumber}
        />

        {/* Weekly Summary Table */}
        <WeeklyTable planDays={planDays} logs={logs} />
      </main>

      <BottomNav />
    </div>
  );
}
