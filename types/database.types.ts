export type GymPlan = 'free' | 'starter' | 'pro' | 'enterprise';
export type GymSubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';
export type UserRole = 'superadmin' | 'owner' | 'trainer' | 'member';
export type MemberStatus = 'active' | 'paused' | 'churned';
export type RiskBand = 'saludable' | 'atencion' | 'en_riesgo';
export type AttendanceSource = 'staff' | 'self';
export type RoutineLevel = 'principiante' | 'intermedio' | 'avanzado';
export type PaymentMethod = 'cash' | 'transfer' | 'card';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type ClassBookingStatus = 'booked' | 'cancelled' | 'attended';

export interface Gym {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  address: string;
  city: string;
  country: string;
  phone: string;
  timezone: string;
  plan: GymPlan;
  subscription_status: GymSubscriptionStatus;
  stripe_customer_id: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  gym_id: string | null;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Member {
  id: string;
  gym_id: string;
  profile_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string | null;
  goal: string;
  joined_at: string;
  status: MemberStatus;
  assigned_trainer_id: string | null;
  assigned_routine_id: string | null;
  risk_score: number;
  risk_band: RiskBand;
  last_attendance_at: string | null;
  membership_expires_at: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  gym_id: string;
  member_id: string;
  checked_in_at: string;
  source: AttendanceSource;
  created_at: string;
}

export interface Routine {
  id: string;
  gym_id: string;
  name: string;
  description: string;
  level: RoutineLevel;
  days_per_week: number;
  created_by: string;
  created_at: string;
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  day_index: number;
  order_index: number;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  video_url: string | null;
  notes: string | null;
}

export interface RoutineAssignment {
  id: string;
  gym_id: string;
  routine_id: string;
  member_id: string;
  assigned_by: string;
  assigned_at: string;
  is_active: boolean;
}

export interface WorkoutLog {
  id: string;
  gym_id: string;
  member_id: string;
  routine_id: string;
  day_index: number;
  completed_at: string;
  duration_minutes: number;
}

export interface Payment {
  id: string;
  gym_id: string;
  member_id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  paid_at: string;
  period_start: string;
  period_end: string;
  status: PaymentStatus;
  created_by: string;
}

export interface ProgressEntry {
  id: string;
  gym_id: string;
  member_id: string;
  recorded_at: string;
  weight_kg: number;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  photo_url: string | null;
  notes: string | null;
}

export interface Class {
  id: string;
  gym_id: string;
  name: string;
  trainer_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
}

export interface ClassBooking {
  id: string;
  gym_id: string;
  class_id: string;
  member_id: string;
  status: ClassBookingStatus;
}

export interface Survey {
  id: string;
  gym_id: string;
  member_id: string;
  workout_log_id: string;
  mood: 1 | 2 | 3 | 4;
  difficulty: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at: string;
}

export interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
}

export interface MemberAchievement {
  id: string;
  gym_id: string;
  member_id: string;
  achievement_code: string;
  unlocked_at: string;
}

export interface Post {
  id: string;
  gym_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  emoji: string;
}

export interface AuditLog {
  id: string;
  gym_id: string;
  actor_id: string;
  action: string;
  entity: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
