export type Sex = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'lightly' | 'moderately' | 'very' | 'extremely';

export interface UserProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  startWeightKg: number;
  goalWeightKg: number;
  activityLevel: ActivityLevel;
  startDate: string; // YYYY-MM-DD
  proteinGPerKg: number; // default 2.1
  fatGPerKg: number;     // default 0.8
  recalDay?: number | null;
  recalWeightKg?: number | null;
}

export interface PlanDay {
  day: number;           // 1..90
  date: string;          // YYYY-MM-DD
  expectedWeightKg: number;
  targetKcal: number;
  targetProteinG: number;
  targetCarbG: number;
  targetFatG: number;
  bmr: number;
  tdee: number;
  isFloorHit: boolean;
}

export interface DailyLogInput {
  day: number;
  weightKg?: number | null;
  proteinG?: number | null;
  carbG?: number | null;
  fatG?: number | null;
  waistCm?: number | null;
  updatedAt?: number;
}

export type StatusPill = 'ahead' | 'on_track' | 'behind';

export interface StatusCardData {
  status: StatusPill;
  diffKg: number; // mean(actual) - mean(expected)
  loggedDaysCount: number;
  meanActualKg: number | null;
  meanExpectedKg: number | null;
}

export interface PlanSummary {
  bmrStart: number;
  tdeeStart: number;
  avgDailyDeficit: number;
  kcalDay1: number;
  kcalDay90: number;
  totalPlannedDropKg: number;
  weeklyDropKg: number;
  weeklyDropPercentBw: number;
}

export interface PlanWarnings {
  isAggressive: boolean; // > 1.0% bw/week
  isNearCeiling: boolean; // > 0.75% bw/week and <= 1.0% bw/week
  isFloorHit: boolean;   // hit calorie floor on any day
}
