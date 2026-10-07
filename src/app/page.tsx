'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatusCard } from '@/components/today/StatusCard';
import { MacroBars } from '@/components/today/MacroBars';
import { LogForm } from '@/components/today/LogForm';
import {
  calculatePlan,
  calculateStatus,
  DailyLogInput,
  getDayForDate,
  getTodayStr,
  PlanDay,
  StatusCardData,
  UserProfile,
} from '@/lib/plan';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

function TodayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DailyLogInput[]>([]);
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(1);
  const [statusData, setStatusData] = useState<StatusCardData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Check auth & profile
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

      // Fetch logs
      const logsRes = await fetch('/api/logs');
      const logsData = logsRes.ok ? await logsRes.json() : { logs: [] };
      const loadedLogs: DailyLogInput[] = logsData.logs || [];
      setLogs(loadedLogs);

      // Compute 90-day plan
      const calculatedPlan = calculatePlan(userProf);
      setPlanDays(calculatedPlan);

      // Determine initial day number: check searchParam ?day=N, otherwise compute from today's date
      const dayParam = searchParams.get('day');
      if (dayParam) {
        const parsed = parseInt(dayParam, 10);
        if (parsed >= 1 && parsed <= 90) {
          setCurrentDayNumber(parsed);
        }
      } else {
        const todayStr = getTodayStr();
        const calculatedToday = getDayForDate(userProf.startDate, todayStr);
        setCurrentDayNumber(calculatedToday ?? 1);
      }

      // Compute 7-day average status card
      const status = calculateStatus(loadedLogs, calculatedPlan);
      setStatusData(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router, searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !profile || planDays.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1319] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cobalt-600" />
      </div>
    );
  }

  const currentPlanDay = planDays[currentDayNumber - 1];
  const currentLog = logs.find((l) => l.day === currentDayNumber) ?? null;

  const handleLogSaved = (updatedLog: DailyLogInput) => {
    const nextLogs = logs.filter((l) => l.day !== updatedLog.day);
    nextLogs.push(updatedLog);
    setLogs(nextLogs);

    // Recompute 7-day status card
    const nextStatus = calculateStatus(nextLogs, planDays);
    setStatusData(nextStatus);
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-[#0b1319]">
      <Header dayNumber={currentDayNumber} />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Date Navigation Header */}
        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <button
            onClick={() => setCurrentDayNumber((prev) => Math.max(1, prev - 1))}
            disabled={currentDayNumber <= 1}
            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            aria-label="วันก่อนหน้า"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="font-brand font-bold text-xl text-slate-900 dark:text-white uppercase tracking-wide">
              วัน {currentDayNumber} จาก 90 วัน
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {currentPlanDay?.date}
            </p>
          </div>

          <button
            onClick={() => setCurrentDayNumber((prev) => Math.min(90, prev + 1))}
            disabled={currentDayNumber >= 90}
            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            aria-label="วันถัดไป"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Status Card */}
        {statusData && <StatusCard data={statusData} />}

        {/* Macro Progress Bars */}
        {currentPlanDay && (
          <MacroBars
            targetKcal={currentPlanDay.targetKcal}
            targetProteinG={currentPlanDay.targetProteinG}
            targetCarbG={currentPlanDay.targetCarbG}
            targetFatG={currentPlanDay.targetFatG}
            actualProteinG={currentLog?.proteinG ?? 0}
            actualCarbG={currentLog?.carbG ?? 0}
            actualFatG={currentLog?.fatG ?? 0}
          />
        )}

        {/* Daily Log Form */}
        <LogForm
          day={currentDayNumber}
          initialLog={currentLog}
          onSaveSuccess={handleLogSaved}
        />
      </main>

      <BottomNav />
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1319] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cobalt-600" />
        </div>
      }
    >
      <TodayContent />
    </Suspense>
  );
}
