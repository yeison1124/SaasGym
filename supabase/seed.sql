Gestión de Gimnasios:-- ==============================================================================
-- GetGym SaaS: Seed de Datos Iniciales
-- Consistente con lib/mock-data.ts y las pantallas de la Fase 2
-- ==============================================================================

-- 1. Catálogo de Logros / Achievements
INSERT INTO public.achievements (code, name, description, icon, threshold) VALUES
('first_week', 'Primera Semana Firme', 'Completaste todos los entrenamientos de tu primera semana.', 'Flame', 3),
('ten_workouts', '10 Entrenos Cumplidos', 'Has registrado 10 sesiones de entrenamiento.', 'Trophy', 10),
('one_month_streak', 'Racha de Hierro (1 Mes)', '4 semanas consecutivas cumpliendo tu objetivo.', 'ShieldCheck', 4)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- 2. Gimnasio Principal (Iron Medellín / Iron Strength)
INSERT INTO public.gyms (
    id,
    name,
    slug,
    logo_url,
    address,
    city,
    country,
    phone,
    timezone,
    plan,
    subscription_status,
    stripe_customer_id,
    trial_ends_at,
    created_at
) VALUES (
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    'Iron Medellín',
    'iron-medellin',
    NULL,
    'Cra. 43A #7-50, El Poblado',
    'Medellín',
    'Colombia',
    '+57 300 123 4567',
    'America/Bogota',
    'starter',
    'active',
    'cus_mock_123',
    NULL,
    '2024-01-15 08:00:00+00'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    plan = EXCLUDED.plan;

-- 3. Usuarios de Auth (auth.users)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES
('00000000-0000-0000-0000-000000000000', 'a1b2c3d4-0000-4000-8000-000000000000', 'authenticated', 'authenticated', 'nico@getgym.io', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nico Sosa","role":"superadmin"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', 'a1b2c3d4-0001-4000-8000-000000000001', 'authenticated', 'authenticated', 'roberto@ironmedellin.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Roberto Gómez","role":"owner","gym_id":"e8b1d9c0-1111-4a1a-9b1b-111111111111"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', 'a1b2c3d4-0002-4000-8000-000000000002', 'authenticated', 'authenticated', 'carlos.ruiz@ironmedellin.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carlos Ruiz","role":"trainer","gym_id":"e8b1d9c0-1111-4a1a-9b1b-111111111111"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', 'a1b2c3d4-0003-4000-8000-000000000003', 'authenticated', 'authenticated', 'maria.fernandez@gmail.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"María Fernández","role":"member","gym_id":"e8b1d9c0-1111-4a1a-9b1b-111111111111"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- 4. Perfiles (public.profiles)
INSERT INTO public.profiles (
    id,
    gym_id,
    role,
    full_name,
    email,
    phone,
    avatar_url,
    is_active,
    created_at
) VALUES
('a1b2c3d4-0000-4000-8000-000000000000', NULL, 'superadmin', 'Nico Sosa', 'nico@getgym.io', '+57 300 000 0000', NULL, true, '2024-01-01 00:00:00+00'),
('a1b2c3d4-0001-4000-8000-000000000001', 'e8b1d9c0-1111-4a1a-9b1b-111111111111', 'owner', 'Roberto Gómez', 'roberto@ironmedellin.com', '+57 300 555 0101', NULL, true, '2024-01-15 08:00:00+00'),
('a1b2c3d4-0002-4000-8000-000000000002', 'e8b1d9c0-1111-4a1a-9b1b-111111111111', 'trainer', 'Carlos Ruiz', 'carlos.ruiz@ironmedellin.com', '+57 300 555 0102', NULL, true, '2024-02-01 09:00:00+00'),
('a1b2c3d4-0003-4000-8000-000000000003', 'e8b1d9c0-1111-4a1a-9b1b-111111111111', 'member', 'María Fernández', 'maria.fernandez@gmail.com', '+57 312 456 7890', NULL, true, '2024-07-10 14:30:00+00')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    gym_id = EXCLUDED.gym_id;

-- 5. Rutinas de Entrenamiento
INSERT INTO public.routines (
    id,
    gym_id,
    name,
    description,
    level,
    days_per_week,
    created_by,
    created_at
) VALUES 
(
    'c1b2c3d4-0001-4000-8000-000000000001',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    'Fuerza & Recomposición (3 Días)',
    'Enfocada en grandes grupos musculares con sobrecarga progresiva y descansos controlados.',
    'intermedio',
    3,
    'a1b2c3d4-0002-4000-8000-000000000002',
    '2024-02-05 10:00:00+00'
),
(
    'c1b2c3d4-0002-4000-8000-000000000002',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    'Iniciación Funcional',
    'Rutina de adaptación cardiovascular y movilidad articular para los primeros 30 días.',
    'principiante',
    2,
    'a1b2c3d4-0002-4000-8000-000000000002',
    '2024-02-10 10:00:00+00'
) ON CONFLICT (id) DO NOTHING;

-- 6. Ejercicios de la Rutina Principal
INSERT INTO public.routine_exercises (
    id,
    routine_id,
    day_index,
    order_index,
    exercise_name,
    sets,
    reps,
    rest_seconds,
    video_url,
    notes
) VALUES
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0001-4000-8000-000000000001', 1, 1, 'Sentadilla Libre con Barra', 4, '10-12', 90, 'https://youtube.com/watch?v=mock1', 'Mantener espalda neutra y descender con cadera atrás.'),
('d1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0001-4000-8000-000000000001', 1, 2, 'Press de Banca Plano', 4, '8-10', 90, 'https://youtube.com/watch?v=mock2', 'Escápulas retraídas y arco lumbar natural.'),
('d1b2c3d4-0003-4000-8000-000000000003', 'c1b2c3d4-0001-4000-8000-000000000001', 1, 3, 'Remo con Mancuerna en Banco', 3, '12 por lado', 60, 'https://youtube.com/watch?v=mock3', 'Traccionar con el codo pegado al torso.'),
('d1b2c3d4-0004-4000-8000-000000000004', 'c1b2c3d4-0001-4000-8000-000000000001', 1, 4, 'Plancha Abdominal Isométrica', 3, '45 seg', 45, NULL, 'Activar glúteos y abdomen sin quebrar la zona lumbar.')
ON CONFLICT (id) DO NOTHING;

-- 7. Miembros de Prueba con Scores de Riesgo Reales
INSERT INTO public.members (
    id,
    gym_id,
    profile_id,
    full_name,
    email,
    phone,
    birth_date,
    goal,
    joined_at,
    status,
    assigned_trainer_id,
    assigned_routine_id,
    risk_score,
    risk_band,
    last_attendance_at,
    membership_expires_at,
    created_at
) VALUES
(
    'b1b2c3d4-0001-4000-8000-000000000001',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    'a1b2c3d4-0003-4000-8000-000000000003',
    'María Fernández',
    'maria.fernandez@gmail.com',
    '+57 312 456 7890',
    '1993-05-14',
    'Tonificación y salud general',
    '2024-07-10 14:30:00+00',
    'active',
    'a1b2c3d4-0002-4000-8000-000000000002',
    'c1b2c3d4-0001-4000-8000-000000000001',
    77,
    'en_riesgo',
    '2024-08-30 18:30:00+00',
    '2024-09-25 23:59:59+00',
    '2024-07-10 14:30:00+00'
),
(
    'b1b2c3d4-0002-4000-8000-000000000002',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    NULL,
    'Juan David Rivas',
    'juandavid.rivas@hotmail.com',
    '+57 310 987 6543',
    '1988-11-20',
    'Aumento de masa muscular',
    '2024-06-01 10:00:00+00',
    'active',
    NULL,
    NULL,
    82,
    'en_riesgo',
    '2024-08-22 07:15:00+00',
    '2024-09-12 23:59:59+00',
    '2024-06-01 10:00:00+00'
),
(
    'b1b2c3d4-0003-4000-8000-000000000003',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    NULL,
    'Carlos Mendoza',
    'carlos.mendoza@gmail.com',
    '+57 315 222 3344',
    '1995-02-18',
    'Definición',
    '2024-04-12 16:00:00+00',
    'active',
    'a1b2c3d4-0002-4000-8000-000000000002',
    'c1b2c3d4-0001-4000-8000-000000000001',
    48,
    'atencion',
    '2024-09-12 19:00:00+00',
    '2024-10-15 23:59:59+00',
    '2024-04-12 16:00:00+00'
),
(
    'b1b2c3d4-0004-4000-8000-000000000004',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    NULL,
    'Camila Ríos',
    'camila.rios@yahoo.com',
    '+57 320 888 9900',
    '1998-09-03',
    'Fuerza y acondicionamiento',
    '2024-03-01 08:00:00+00',
    'active',
    'a1b2c3d4-0002-4000-8000-000000000002',
    'c1b2c3d4-0001-4000-8000-000000000001',
    12,
    'saludable',
    '2024-09-15 07:00:00+00',
    '2024-11-30 23:59:59+00',
    '2024-03-01 08:00:00+00'
),
(
    'b1b2c3d4-0005-4000-8000-000000000005',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    NULL,
    'Andrés Herrera',
    'andres.h@gmail.com',
    '+57 311 444 5566',
    '1990-12-05',
    'Pérdida de grasa',
    '2024-02-15 11:00:00+00',
    'active',
    'a1b2c3d4-0002-4000-8000-000000000002',
    'c1b2c3d4-0002-4000-8000-000000000002',
    18,
    'saludable',
    '2024-09-14 18:00:00+00',
    '2024-10-28 23:59:59+00',
    '2024-02-15 11:00:00+00'
) ON CONFLICT (id) DO NOTHING;

-- 8. Pagos
INSERT INTO public.payments (
    id,
    gym_id,
    member_id,
    amount,
    currency,
    method,
    paid_at,
    period_start,
    period_end,
    status,
    created_by
) VALUES
(
    'e1b2c3d4-0001-4000-8000-000000000001',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    'b1b2c3d4-0001-4000-8000-000000000001',
    30.00,
    'USD',
    'card',
    '2024-08-25 15:20:00+00',
    '2024-08-25 00:00:00+00',
    '2024-09-25 23:59:59+00',
    'paid',
    'a1b2c3d4-0001-4000-8000-000000000001'
),
(
    'e1b2c3d4-0002-4000-8000-000000000002',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    'b1b2c3d4-0002-4000-8000-000000000002',
    30.00,
    'USD',
    'cash',
    '2024-08-12 10:00:00+00',
    '2024-08-12 00:00:00+00',
    '2024-09-12 23:59:59+00',
    'paid',
    'a1b2c3d4-0001-4000-8000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- 9. Asignación de Rutina para María
INSERT INTO public.routine_assignments (
    id,
    gym_id,
    routine_id,
    member_id,
    assigned_by,
    assigned_at,
    is_active
) VALUES (
    'f1b2c3d4-0001-4000-8000-000000000001',
    'e8b1d9c0-1111-4a1a-9b1b-111111111111',
    'c1b2c3d4-0001-4000-8000-000000000001',
    'b1b2c3d4-0001-4000-8000-000000000001',
    'a1b2c3d4-0002-4000-8000-000000000002',
    '2024-07-15 10:00:00+00',
    true
) ON CONFLICT (id) DO NOTHING;

-- 10. Evolución Física / Mediciones de María
INSERT INTO public.progress_entries (
    id,
    gym_id,
    member_id,
    recorded_at,
    weight_kg,
    body_fat_pct,
    chest_cm,
    waist_cm,
    hip_cm,
    arm_cm,
    thigh_cm,
    notes
) VALUES
('11b2c3d4-0001-4000-8000-000000000001', 'e8b1d9c0-1111-4a1a-9b1b-111111111111', 'b1b2c3d4-0001-4000-8000-000000000001', '2024-07-10 15:00:00+00', 68.5, 28.2, 94.0, 78.0, 104.0, 29.0, 58.0, 'Medición inicial al comenzar el plan.'),
('11b2c3d4-0002-4000-8000-000000000002', 'e8b1d9c0-1111-4a1a-9b1b-111111111111', 'b1b2c3d4-0001-4000-8000-000000000001', '2024-08-15 15:00:00+00', 66.8, 26.4, 92.0, 75.0, 102.0, 29.5, 57.0, 'Gran progreso en cintura y mayor energía.')
ON CONFLICT (id) DO NOTHING;

-- 11. Logros Desbloqueados por María
INSERT INTO public.member_achievements (
    id,
    gym_id,
    member_id,
    achievement_code,
    unlocked_at
) VALUES
('21b2c3d4-0001-4000-8000-000000000001', 'e8b1d9c0-1111-4a1a-9b1b-111111111111', 'b1b2c3d4-0001-4000-8000-000000000001', 'first_week', '2024-07-17 20:00:00+00'),
('21b2c3d4-0002-4000-8000-000000000002', 'e8b1d9c0-1111-4a1a-9b1b-111111111111', 'b1b2c3d4-0001-4000-8000-000000000001', 'ten_workouts', '2024-08-20 20:00:00+00')
ON CONFLICT (id) DO NOTHING;
