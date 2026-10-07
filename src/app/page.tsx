'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { NavLayout } from '@/components/ui/NavLayout';
import { StatusCard } from '@/components/today/StatusCard';
import { MacroBars } from '@/components/today/MacroBars';
import { LogForm } from '@/components/today/LogForm';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/Icon';
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

      // Determine day number
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

      // Compute 7-day status card
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
      <NavLayout>
        <Header />
        <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
          <Skeleton variant="card" className="h-16" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton variant="card" className="h-64" />
            <Skeleton variant="card" className="h-64" />
          </div>
        </main>
      </NavLayout>
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
    <NavLayout>
      <Header dayNumber={currentDayNumber} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Date Selector Header */}
        <Card variant="default" padding="sm" className="flex items-center justify-between">
          <IconButton
            ariaLabel="วันก่อนหน้า"
            onClick={() => setCurrentDayNumber((prev) => Math.max(1, prev - 1))}
            disabled={currentDayNumber <= 1}
            variant="secondary"
            size="md"
          >
            <Icon name="ChevronLeft" size={20} />
          </IconButton>

          <div className="text-center">
            <h1 className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)] uppercase tracking-wide flex items-center justify-center gap-2">
              <span>วัน {currentDayNumber} จาก 90 วัน</span>
              {currentDayNumber === getDayForDate(profile.startDate, getTodayStr()) && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brass-400 text-obsidian-950">
                  วันนี้
                </span>
              )}
            </h1>
            <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
              {currentPlanDay?.date}
            </p>
          </div>

          <IconButton
            ariaLabel="วันถัดไป"
            onClick={() => setCurrentDayNumber((prev) => Math.min(90, prev + 1))}
            disabled={currentDayNumber >= 90}
            variant="secondary"
            size="md"
          >
            <Icon name="ChevronRight" size={20} />
          </IconButton>
        </Card>

        {/* Responsive Desktop Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Hero Status & Nutrition Targets) */}
          <div className="lg:col-span-6 space-y-6">
            {statusData && (
              <StatusCard
                data={statusData}
                startWeightKg={profile.startWeightKg}
                goalWeightKg={profile.goalWeightKg}
                currentDayNumber={currentDayNumber}
              />
            )}

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
          </div>

          {/* Right Column (Daily Logging Form) */}
          <div className="lg:col-span-6">
            <LogForm
              day={currentDayNumber}
              initialLog={currentLog}
              onSaveSuccess={handleLogSaved}
            />
          </div>
        </div>
      </main>
    </NavLayout>
  );
}

export default function TodayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
          <Skeleton variant="circle" className="w-12 h-12" />
        </div>
      }
    >
      <TodayContent />
    </Suspense>
  );
}
