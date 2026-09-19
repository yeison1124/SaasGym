import { RiskBand } from '@/types/database.types';

export interface RiskScoreBreakdown {
  daysSinceLastAttendancePoints: number;
  frequencyDropPoints: number;
  noRoutinePoints: number;
  paymentStatusPoints: number;
  tenureUnder90DaysPoints: number;
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
}): RiskScoreBreakdown {
  const {
    daysSinceLastAttendance,
    avgWeeklyLast2Weeks,
    avgWeeklyPrev4Weeks,
    hasAssignedRoutine,
    paymentStatus,
    daysUntilPaymentExpires,
    tenureInDays,
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

  const totalScore = Math.min(
    100,
    daysSinceLastAttendancePoints +
      frequencyDropPoints +
      noRoutinePoints +
      paymentStatusPoints +
      tenureUnder90DaysPoints
  );

  return {
    daysSinceLastAttendancePoints,
    frequencyDropPoints,
    noRoutinePoints,
    paymentStatusPoints,
    tenureUnder90DaysPoints,
    totalScore,
    riskBand: getRiskBand(totalScore),
  };
}
