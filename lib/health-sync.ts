/**
 * GymPulse HealthKit & Fitbit Synchronization Engine
 * Conecta y sincroniza métricas biométricas:
 * - Frecuencia cardíaca (FC promedio y máxima en entrenamiento)
 * - Calorías quemadas
 * - Pasos diarios
 * - Calidad del sueño (Horas y porcentaje de sueño profundo/REM)
 */

export type HealthProvider = 'apple_health' | 'fitbit';

export interface WorkoutHeartRate {
  avgBpm: number;
  maxBpm: number;
  zone: 'Cardio' | 'Quema de Grasa' | 'Pico';
  timestamp: string;
}

export interface SleepMetrics {
  durationHours: number;
  qualityScore: number; // 0 a 100
  deepSleepHours: number;
  remSleepHours: number;
  rating: 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente';
}

export interface MemberHealthData {
  memberId: string;
  provider: HealthProvider | 'both' | 'none';
  isConnected: boolean;
  lastSync: string;
  todaySteps: number;
  stepsGoal: number;
  todayCalories: number;
  caloriesGoal: number;
  workoutHeartRate: WorkoutHeartRate;
  sleep: SleepMetrics;
  weeklyStepsHistory: { day: string; steps: number; calories: number }[];
}

export const DEFAULT_MEMBER_HEALTH_DATA: MemberHealthData = {
  memberId: '88888888-8888-8888-8888-888888888888',
  provider: 'both',
  isConnected: true,
  lastSync: 'Sincronizado hace 4 min',
  todaySteps: 9420,
  stepsGoal: 10000,
  todayCalories: 580,
  caloriesGoal: 650,
  workoutHeartRate: {
    avgBpm: 142,
    maxBpm: 174,
    zone: 'Cardio',
    timestamp: 'Hoy, 08:30 AM',
  },
  sleep: {
    durationHours: 7.8,
    qualityScore: 88,
    deepSleepHours: 2.1,
    remSleepHours: 1.9,
    rating: 'Excelente',
  },
  weeklyStepsHistory: [
    { day: 'Lun', steps: 8400, calories: 510 },
    { day: 'Mar', steps: 10200, calories: 630 },
    { day: 'Mié', steps: 9100, calories: 540 },
    { day: 'Jue', steps: 11500, calories: 720 },
    { day: 'Vie', steps: 9800, calories: 590 },
    { day: 'Sáb', steps: 12400, calories: 780 },
    { day: 'Dom', steps: 9420, calories: 580 },
  ],
};

const HEALTH_STORAGE_KEY = 'gympulse_health_sync_data';

export function getStoredHealthData(): MemberHealthData {
  if (typeof window === 'undefined') return DEFAULT_MEMBER_HEALTH_DATA;
  try {
    const raw = localStorage.getItem(HEALTH_STORAGE_KEY);
    if (!raw) return DEFAULT_MEMBER_HEALTH_DATA;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_MEMBER_HEALTH_DATA;
  }
}

export function saveStoredHealthData(data: MemberHealthData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving health data:', e);
  }
}

export async function syncProviderData(provider: HealthProvider): Promise<MemberHealthData> {
  // Simular conexión API en tiempo real con Apple HealthKit / Fitbit
  await new Promise((resolve) => setTimeout(resolve, 800));

  const current = getStoredHealthData();
  const updated: MemberHealthData = {
    ...current,
    isConnected: true,
    provider: current.provider === 'none' ? provider : 'both',
    lastSync: 'Sincronizado hace un momento',
    todaySteps: current.todaySteps + Math.floor(Math.random() * 80) + 20,
    todayCalories: current.todayCalories + Math.floor(Math.random() * 15) + 5,
  };

  saveStoredHealthData(updated);
  return updated;
}
