import { RiskBand } from '@/types/database.types';

export interface WearableHealthFactors {
  dailySteps?: number;
  sleepQualityScore?: number;
  caloriesBurned?: number;
  isWearableSynced?: boolean;
}

export interface RiskScoreBreakdown {
  daysSinceLastAttendancePoints: number;
  frequencyDropPoints: number;
  noRoutinePoints: number;
  paymentStatusPoints: number;
  tenureUnder90DaysPoints: number;
  wearableAdjustmentPoints: number; // Factor biométrico HealthKit / Fitbit
  totalScore: number;
  riskBand: RiskBand;
}

export function getRiskBand(score: number): RiskBand {
  if (score >= 60) return 'en_riesgo';
  if (score >= 30) return 'atencion';
  return 'saludable';
}

export function calculateRiskScore(params: {
  daysSinceLastAttendance: number | null;
  avgWeeklyLast2Weeks: number;
  avgWeeklyPrev4Weeks: number;
  hasAssignedRoutine: boolean;
  paymentStatus: 'paid' | 'pending' | 'failed';
  daysUntilPaymentExpires: number;
  tenureInDays: number;
  wearables?: WearableHealthFactors;
}): RiskScoreBreakdown {
  const {
    daysSinceLastAttendance,
    avgWeeklyLast2Weeks,
    avgWeeklyPrev4Weeks,
    hasAssignedRoutine,
    paymentStatus,
    daysUntilPaymentExpires,
    tenureInDays,
    wearables,
  } = params;

  // 1. Días desde la última asistencia (max 35)
  let daysSinceLastAttendancePoints = 0;
  if (daysSinceLastAttendance === null || daysSinceLastAttendance >= 21) {
    daysSinceLastAttendancePoints = 35;
  } else if (daysSinceLastAttendance >= 14) {
    daysSinceLastAttendancePoints = 30;
  } else if (daysSinceLastAttendance >= 7) {
    daysSinceLastAttendancePoints = 15;
  } else {
    daysSinceLastAttendancePoints = 0;
  }

  // 2. Caída de frecuencia semanal (max 25)
  let frequencyDropPoints = 0;
  if (avgWeeklyPrev4Weeks > 0) {
    const dropPercentage = (avgWeeklyPrev4Weeks - avgWeeklyLast2Weeks) / avgWeeklyPrev4Weeks;
    if (dropPercentage > 0.5) {
      frequencyDropPoints = 25;
    }
  }

  // 3. Sin rutina asignada (max 15)
  const noRoutinePoints = hasAssignedRoutine ? 0 : 15;

  // 4. Estado de pago (max 15)
  let paymentStatusPoints = 0;
  if (paymentStatus === 'failed' || daysUntilPaymentExpires < 0) {
    paymentStatusPoints = 15;
  } else if (daysUntilPaymentExpires <= 7) {
    paymentStatusPoints = 7;
  }

  // 5. Antigüedad < 90 días (max 10)
  const tenureUnder90DaysPoints = tenureInDays < 90 ? 10 : 0;

  // 6. Impacto Biométrico de Wearables (Apple Health / Fitbit)
  let wearableAdjustmentPoints = 0;
  if (wearables && wearables.isWearableSynced) {
    const steps = wearables.dailySteps ?? 0;
    const sleepQuality = wearables.sleepQualityScore ?? 0;

    if (steps >= 8500 && sleepQuality >= 75) {
      // Usuario activo y saludable fuera del gym -> reduce riesgo de abandono
      wearableAdjustmentPoints = -15;
    } else if (steps < 4000 && sleepQuality < 60) {
      // Sedentarismo y mal descanso -> aumenta riesgo de deserción
      wearableAdjustmentPoints = +10;
    }
  }

  const baseScore =
    daysSinceLastAttendancePoints +
    frequencyDropPoints +
    noRoutinePoints +
    paymentStatusPoints +
    tenureUnder90DaysPoints +
    wearableAdjustmentPoints;

  const totalScore = Math.max(0, Math.min(100, baseScore));

  return {
    daysSinceLastAttendancePoints,
    frequencyDropPoints,
    noRoutinePoints,
    paymentStatusPoints,
    tenureUnder90DaysPoints,
    wearableAdjustmentPoints,
    totalScore,
    riskBand: getRiskBand(totalScore),
  };
}

