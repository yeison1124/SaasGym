-- ==============================================================================
-- GetGym SaaS: Migración Inicial del Esquema Completo y Políticas RLS
-- Basado estrictamente en la Sección 8 y 8.2 del PRD
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tipos personalizados (ENUMs)
DO $$ BEGIN
    CREATE TYPE gym_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE gym_subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('superadmin', 'owner', 'trainer', 'member');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE member_status AS ENUM ('active', 'paused', 'churned');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE risk_band AS ENUM ('saludable', 'atencion', 'en_riesgo');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE attendance_source AS ENUM ('staff', 'self');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE routine_level AS ENUM ('principiante', 'intermedio', 'avanzado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'transfer', 'card');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE class_booking_status AS ENUM ('booked', 'cancelled', 'attended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 3. Creación de Tablas (18 Tablas Principales de la Sección 8.1)
-- ==============================================================================

-- 1. GYMS (El tenant principal)
CREATE TABLE IF NOT EXISTS public.gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'America/Bogota',
    plan gym_plan NOT NULL DEFAULT 'starter',
    subscription_status gym_subscription_status NOT NULL DEFAULT 'trialing',
    stripe_customer_id TEXT,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PROFILES (Extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'member',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. ROUTINES (Plantillas de entrenamiento)
CREATE TABLE IF NOT EXISTS public.routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    level routine_level NOT NULL DEFAULT 'principiante',
    days_per_week INTEGER NOT NULL DEFAULT 3,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. MEMBERS (Datos de negocio del miembro)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    birth_date DATE,
    goal TEXT NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status member_status NOT NULL DEFAULT 'active',
    assigned_trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_routine_id UUID REFERENCES public.routines(id) ON DELETE SET NULL,
    risk_score INTEGER NOT NULL DEFAULT 0,
    risk_band risk_band NOT NULL DEFAULT 'saludable',
    last_attendance_at TIMESTAMPTZ,
    membership_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ATTENDANCES (Registro de asistencias y check-ins)
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    source attendance_source NOT NULL DEFAULT 'staff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ROUTINE_EXERCISES (Ejercicios que componen la rutina)
CREATE TABLE IF NOT EXISTS public.routine_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
    day_index INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 1,
    exercise_name TEXT NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    reps TEXT NOT NULL DEFAULT '10-12',
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    video_url TEXT,
    notes TEXT
);

-- 7. ROUTINE_ASSIGNMENTS (Asignaciones activas de rutinas a miembros)
CREATE TABLE IF NOT EXISTS public.routine_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 8. WORKOUT_LOGS (Registro de sesión completada por el miembro)
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
    day_index INTEGER NOT NULL DEFAULT 1,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    duration_minutes INTEGER NOT NULL DEFAULT 45
);

-- 9. PAYMENTS (Cobros y membresías del gimnasio)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    method payment_method NOT NULL DEFAULT 'card',
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    status payment_status NOT NULL DEFAULT 'paid',
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT
);

-- 10. PROGRESS_ENTRIES (Evolución física, peso y medidas)
CREATE TABLE IF NOT EXISTS public.progress_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    weight_kg NUMERIC(5,2) NOT NULL,
    body_fat_pct NUMERIC(4,2),
    chest_cm NUMERIC(5,2),
    waist_cm NUMERIC(5,2),
    hip_cm NUMERIC(5,2),
    arm_cm NUMERIC(5,2),
    thigh_cm NUMERIC(5,2),
    photo_url TEXT,
    notes TEXT
);

-- 11. CLASSES (Agenda y clases del gimnasio)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 20
);

-- 12. CLASS_BOOKINGS (Reservas de cupos de miembros)
CREATE TABLE IF NOT EXISTS public.class_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    status class_booking_status NOT NULL DEFAULT 'booked',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (class_id, member_id)
);

-- 13. SURVEYS (Encuesta post-entreno de 1 toque)
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE SET NULL,
    mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 4),
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. ACHIEVEMENTS (Catálogo de insignias)
CREATE TABLE IF NOT EXISTS public.achievements (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    threshold INTEGER NOT NULL DEFAULT 1
);

-- 15. MEMBER_ACHIEVEMENTS (Logros desbloqueados por miembros)
CREATE TABLE IF NOT EXISTS public.member_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    achievement_code TEXT NOT NULL REFERENCES public.achievements(code) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (member_id, achievement_code)
);

-- 16. POSTS (Feed de comunidad interna del gimnasio)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. POST_REACTIONS (Reacciones a los posts de la comunidad)
CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (post_id, user_id, emoji)
);

-- 18. AUDIT_LOGS (Registro de auditoría para acciones sensibles)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. Funciones Auxiliares de Seguridad (SECURITY DEFINER para RLS)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.auth_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.auth_gym_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT gym_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.auth_member_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT id FROM public.members WHERE profile_id = auth.uid();
$$;

-- Trigger para crear perfil automáticamente al registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, gym_id)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        new.email,
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'member'::user_role),
        (new.raw_user_meta_data->>'gym_id')::UUID
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. Habilitación de Row Level Security (RLS) en las 18 Tablas
-- ==============================================================================

ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 6. Políticas de RLS (Sección 8.2 del PRD)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Tablas de Catálogo Global: ACHIEVEMENTS
-- ------------------------------------------------------------------------------
CREATE POLICY "achievements_read_all" ON public.achievements
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "achievements_admin_all" ON public.achievements
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

-- ------------------------------------------------------------------------------
-- GYMS
-- ------------------------------------------------------------------------------
CREATE POLICY "gyms_superadmin_all" ON public.gyms
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "gyms_owner_read_update" ON public.gyms
    FOR ALL TO authenticated USING (id = public.auth_gym_id() AND public.auth_role() = 'owner');

CREATE POLICY "gyms_members_trainers_read" ON public.gyms
    FOR SELECT TO authenticated USING (id = public.auth_gym_id());

-- ------------------------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------------------------
CREATE POLICY "profiles_superadmin_all" ON public.profiles
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "profiles_gym_staff_read" ON public.profiles
    FOR SELECT TO authenticated USING (gym_id = public.auth_gym_id());

CREATE POLICY "profiles_owner_all" ON public.profiles
    FOR ALL TO authenticated USING (gym_id = public.auth_gym_id() AND public.auth_role() = 'owner');

CREATE POLICY "profiles_self_read_update" ON public.profiles
    FOR ALL TO authenticated USING (id = auth.uid());

-- ------------------------------------------------------------------------------
-- MEMBERS
-- ------------------------------------------------------------------------------
CREATE POLICY "members_superadmin_all" ON public.members
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "members_owner_all" ON public.members
    FOR ALL TO authenticated USING (gym_id = public.auth_gym_id() AND public.auth_role() = 'owner');

CREATE POLICY "members_trainer_read" ON public.members
    FOR SELECT TO authenticated USING (gym_id = public.auth_gym_id() AND public.auth_role() = 'trainer');

CREATE POLICY "members_self_read_update" ON public.members
    FOR SELECT TO authenticated USING (profile_id = auth.uid());

-- ------------------------------------------------------------------------------
-- ROUTINES & ROUTINE_EXERCISES
-- ------------------------------------------------------------------------------
CREATE POLICY "routines_superadmin_all" ON public.routines
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "routines_gym_staff_all" ON public.routines
    FOR ALL TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "routines_member_read" ON public.routines
    FOR SELECT TO authenticated USING (gym_id = public.auth_gym_id());

CREATE POLICY "routine_exercises_superadmin_all" ON public.routine_exercises
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "routine_exercises_staff_all" ON public.routine_exercises
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.routines r
            WHERE r.id = routine_id AND r.gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
        )
    );

CREATE POLICY "routine_exercises_member_read" ON public.routine_exercises
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.routines r
            WHERE r.id = routine_id AND r.gym_id = public.auth_gym_id()
        )
    );

-- ------------------------------------------------------------------------------
-- ROUTINE_ASSIGNMENTS
-- ------------------------------------------------------------------------------
CREATE POLICY "routine_assignments_superadmin_all" ON public.routine_assignments
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "routine_assignments_staff_all" ON public.routine_assignments
    FOR ALL TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "routine_assignments_member_read" ON public.routine_assignments
    FOR SELECT TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- ATTENDANCES
-- ------------------------------------------------------------------------------
CREATE POLICY "attendances_superadmin_all" ON public.attendances
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "attendances_staff_all" ON public.attendances
    FOR ALL TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "attendances_member_self" ON public.attendances
    FOR ALL TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- WORKOUT_LOGS
-- ------------------------------------------------------------------------------
CREATE POLICY "workout_logs_superadmin_all" ON public.workout_logs
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "workout_logs_staff_read" ON public.workout_logs
    FOR SELECT TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "workout_logs_member_self" ON public.workout_logs
    FOR ALL TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- PAYMENTS (RESTRICCIÓN ESTRICTA: SIN ACCESO PARA TRAINERS)
-- ------------------------------------------------------------------------------
CREATE POLICY "payments_superadmin_all" ON public.payments
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "payments_owner_all" ON public.payments
    FOR ALL TO authenticated USING (gym_id = public.auth_gym_id() AND public.auth_role() = 'owner');

CREATE POLICY "payments_member_read_own" ON public.payments
    FOR SELECT TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- PROGRESS_ENTRIES
-- ------------------------------------------------------------------------------
CREATE POLICY "progress_entries_superadmin_all" ON public.progress_entries
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "progress_entries_staff_read" ON public.progress_entries
    FOR SELECT TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "progress_entries_member_self" ON public.progress_entries
    FOR ALL TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- CLASSES & CLASS_BOOKINGS
-- ------------------------------------------------------------------------------
CREATE POLICY "classes_superadmin_all" ON public.classes
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "classes_staff_all" ON public.classes
    FOR ALL TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "classes_member_read" ON public.classes
    FOR SELECT TO authenticated USING (gym_id = public.auth_gym_id());

CREATE POLICY "class_bookings_superadmin_all" ON public.class_bookings
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "class_bookings_staff_read" ON public.class_bookings
    FOR SELECT TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "class_bookings_member_self" ON public.class_bookings
    FOR ALL TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- SURVEYS
-- ------------------------------------------------------------------------------
CREATE POLICY "surveys_superadmin_all" ON public.surveys
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "surveys_staff_read" ON public.surveys
    FOR SELECT TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "surveys_member_self" ON public.surveys
    FOR ALL TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- MEMBER_ACHIEVEMENTS
-- ------------------------------------------------------------------------------
CREATE POLICY "member_achievements_superadmin_all" ON public.member_achievements
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "member_achievements_staff_read" ON public.member_achievements
    FOR SELECT TO authenticated USING (
        gym_id = public.auth_gym_id() AND public.auth_role() IN ('owner', 'trainer')
    );

CREATE POLICY "member_achievements_member_self" ON public.member_achievements
    FOR ALL TO authenticated USING (member_id = public.auth_member_id());

-- ------------------------------------------------------------------------------
-- POSTS & POST_REACTIONS
-- ------------------------------------------------------------------------------
CREATE POLICY "posts_superadmin_all" ON public.posts
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "posts_gym_read" ON public.posts
    FOR SELECT TO authenticated USING (gym_id = public.auth_gym_id());

CREATE POLICY "posts_gym_create" ON public.posts
    FOR INSERT TO authenticated WITH CHECK (
        gym_id = public.auth_gym_id() AND author_id = auth.uid()
    );

CREATE POLICY "post_reactions_superadmin_all" ON public.post_reactions
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "post_reactions_gym_read" ON public.post_reactions
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.gym_id = public.auth_gym_id()
        )
    );

CREATE POLICY "post_reactions_user_manage" ON public.post_reactions
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- AUDIT_LOGS
-- ------------------------------------------------------------------------------
CREATE POLICY "audit_logs_superadmin_all" ON public.audit_logs
    FOR ALL TO authenticated USING (public.auth_role() = 'superadmin');

CREATE POLICY "audit_logs_owner_read" ON public.audit_logs
    FOR SELECT TO authenticated USING (gym_id = public.auth_gym_id() AND public.auth_role() = 'owner');

CREATE POLICY "audit_logs_insert" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (gym_id = public.auth_gym_id());
