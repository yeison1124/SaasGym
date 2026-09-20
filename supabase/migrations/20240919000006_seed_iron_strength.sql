-- ==============================================================================
-- Seed de datos realistas para Iron Strength Medellín (Roberto Martínez)
-- ==============================================================================

DO $$
DECLARE
    v_gym_id UUID;
    v_roberto_id UUID;

    -- IDs Rutinas
    v_routine_hiper UUID := 'd0000000-0000-0000-0000-000000000001';
    v_routine_hiit30 UUID := 'd0000000-0000-0000-0000-000000000002';
    v_routine_treninf UUID := 'd0000000-0000-0000-0000-000000000003';
    v_routine_fullbody UUID := 'd0000000-0000-0000-0000-000000000004';
    v_routine_recup UUID := 'd0000000-0000-0000-0000-000000000005';
    v_routine_hiit UUID := 'd0000000-0000-0000-0000-000000000006';

    -- IDs Miembros
    v_m_juan UUID := 'e0000000-0000-0000-0000-000000000001';
    v_m_daniela UUID := 'e0000000-0000-0000-0000-000000000002';
    v_m_mariana UUID := 'e0000000-0000-0000-0000-000000000003';
    v_m_andres UUID := 'e0000000-0000-0000-0000-000000000004';
    v_m_florencia UUID := 'e0000000-0000-0000-0000-000000000005';
    v_m_mauricio UUID := 'e0000000-0000-0000-0000-000000000006';
    v_m_tomas UUID := 'e0000000-0000-0000-0000-000000000007';
    v_m_sofia UUID := 'e0000000-0000-0000-0000-000000000008';
    v_m_pedro UUID := 'e0000000-0000-0000-0000-000000000009';
    v_m_camila UUID := 'e0000000-0000-0000-0000-000000000010';
    v_m_lucas UUID := 'e0000000-0000-0000-0000-000000000011';
    v_m_mateo UUID := 'e0000000-0000-0000-0000-000000000012';

BEGIN
    -- Obtener el ID de Roberto Martínez y de su Gym
    SELECT id, gym_id INTO v_roberto_id, v_gym_id
    FROM public.profiles
    WHERE email = 'roberto@ironstrength.co'
    LIMIT 1;

    IF v_roberto_id IS NULL THEN
        SELECT id, gym_id INTO v_roberto_id, v_gym_id
        FROM public.profiles
        WHERE role = 'owner'
        LIMIT 1;
    END IF;

    IF v_roberto_id IS NOT NULL AND v_gym_id IS NOT NULL THEN
        -- 1. Insertar Rutinas
        INSERT INTO public.routines (id, gym_id, name, description, level, days_per_week, created_by, created_at)
        VALUES
            (v_routine_hiper, v_gym_id, 'Hipertrofia 4 días', 'Enfoque en ganancia de masa muscular y fuerza base.', 'avanzado', 2, v_roberto_id, now() - interval '1 days'),
            (v_routine_hiit30, v_gym_id, 'Cardio HIIT 30 min', 'Entrenamiento por intervalos de alta intensidad para quema calórica.', 'intermedio', 3, v_roberto_id, now() - interval '1 days'),
            (v_routine_treninf, v_gym_id, 'Tren inferior mujer', 'Rutina focalizada en glúteos, femorales y cuádriceps.', 'intermedio', 3, v_roberto_id, now() - interval '2 days'),
            (v_routine_hiit, v_gym_id, 'Cardio HIIT', 'Circuito de potencia cardiovascular y core.', 'intermedio', 3, v_roberto_id, now() - interval '3 days'),
            (v_routine_fullbody, v_gym_id, 'Full body principiante', 'Adaptación neuromuscular integral para nuevos miembros.', 'principiante', 3, v_roberto_id, now() - interval '5 days'),
            (v_routine_recup, v_gym_id, 'Recuperación activa', 'Movilidad articular, estiramientos dinámicos y descarga.', 'principiante', 2, v_roberto_id, now() - interval '6 days')
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            level = EXCLUDED.level,
            days_per_week = EXCLUDED.days_per_week,
            gym_id = EXCLUDED.gym_id,
            created_by = EXCLUDED.created_by;

        -- 2. Insertar Ejercicios de Rutinas
        DELETE FROM public.routine_exercises WHERE routine_id IN (v_routine_hiper, v_routine_hiit30);
        INSERT INTO public.routine_exercises (routine_id, day_index, order_index, exercise_name, sets, reps, rest_seconds, video_url, notes)
        VALUES
            (v_routine_hiper, 1, 1, 'Press de banca plano con barra', 4, '8-10', 90, 'https://youtube.com', 'Controlar la fase excéntrica'),
            (v_routine_hiper, 1, 2, 'Sentadilla trasera profunda', 4, '6-8', 120, 'https://youtube.com', 'Mantener core firme'),
            (v_routine_hiit30, 1, 1, 'Burpees con salto explosivo', 4, '15', 30, 'https://youtube.com', 'Máxima velocidad'),
            (v_routine_hiit30, 1, 2, 'Kettlebell swings', 4, '20', 45, 'https://youtube.com', 'Empuje desde caderas'),
            (v_routine_hiit30, 1, 3, 'Mountain climbers', 4, '45 seg', 30, 'https://youtube.com', 'Ritmo constante');

        -- 3. Insertar Miembros
        INSERT INTO public.members (id, gym_id, full_name, email, phone, goal, joined_at, status, assigned_trainer_id, assigned_routine_id, risk_score, risk_band, last_attendance_at, membership_expires_at, created_at)
        VALUES
            (v_m_juan, v_gym_id, 'Juan Pablo Diaz', 'juan.rios@example.com', '+57 310 987 6543', 'Hipertrofia', now() - interval '180 days', 'churned', null, v_routine_hiper, 92, 'en_riesgo', now() - interval '1 days', now() - interval '5 days', now() - interval '180 days'),
            (v_m_daniela, v_gym_id, 'Daniela Castro', 'daniela.castro@example.com', '+57 311 234 5678', 'Definición', now() - interval '150 days', 'active', null, v_routine_treninf, 64, 'atencion', now() - interval '10 days', now() + interval '20 days', now() - interval '150 days'),
            (v_m_mariana, v_gym_id, 'Mariana Soto', 'mariana.soto@example.com', '+57 312 345 6789', 'Salud', now() - interval '300 days', 'paused', null, v_routine_hiit30, 50, 'atencion', now() - interval '15 days', now() + interval '5 days', now() - interval '300 days'),
            (v_m_andres, v_gym_id, 'Andrés Suárez', 'andres.suarez@example.com', '+57 313 456 7890', 'Fuerza', now() - interval '120 days', 'active', null, v_routine_hiper, 21, 'saludable', now() - interval '8 days', now() + interval '30 days', now() - interval '120 days'),
            (v_m_florencia, v_gym_id, 'Florencia Méndez', 'florencia.mendez@example.com', '+57 314 567 8901', 'Cardio', now() - interval '90 days', 'active', null, v_routine_fullbody, 18, 'saludable', now() - interval '7 days', now() - interval '2 days', now() - interval '90 days'),
            (v_m_mauricio, v_gym_id, 'Mauricio Toro', 'mauricio.toro@example.com', '+57 315 678 9012', 'Masa muscular', now() - interval '240 days', 'active', null, v_routine_hiper, 15, 'saludable', now() - interval '6 days', now() + interval '90 days', now() - interval '240 days'),
            (v_m_tomas, v_gym_id, 'Tomás Rivera', 'tomas.rivera@example.com', '+57 316 789 0123', 'Potencia', now() - interval '60 days', 'active', null, v_routine_hiper, 3, 'saludable', now() - interval '2 days', now() + interval '120 days', now() - interval '60 days'),
            (v_m_sofia, v_gym_id, 'Sofia Romero', 'sofia.romero@example.com', '+57 317 890 1234', 'Tonificación', now() - interval '30 days', 'active', null, v_routine_treninf, 10, 'saludable', now() - interval '1 days', now() + interval '25 days', now() - interval '30 days'),
            (v_m_pedro, v_gym_id, 'Pedro González', 'pedro.gonzalez@example.com', '+57 318 901 2345', 'Fuerza', now() - interval '15 days', 'active', null, v_routine_hiper, 8, 'saludable', now() - interval '1 days', now() + interval '28 days', now() - interval '15 days'),
            (v_m_camila, v_gym_id, 'Camila Vega', 'camila.vega@example.com', '+57 319 012 3456', 'Pérdida de peso', now() - interval '10 days', 'active', null, v_routine_treninf, 12, 'saludable', now() - interval '3 days', now() + interval '60 days', now() - interval '10 days'),
            (v_m_lucas, v_gym_id, 'Lucas Benítez', 'lucas.benitez@example.com', '+57 320 123 4567', 'Rendimiento', now() - interval '8 days', 'active', null, v_routine_hiper, 5, 'saludable', now() - interval '2 days', now() + interval '26 days', now() - interval '8 days'),
            (v_m_mateo, v_gym_id, 'Mateo Silva', 'mateo.silva@example.com', '+57 321 234 5678', 'General', now() - interval '5 days', 'active', null, v_routine_fullbody, 4, 'saludable', now() - interval '1 days', now() + interval '29 days', now() - interval '5 days')
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            email = EXCLUDED.email,
            risk_score = EXCLUDED.risk_score,
            risk_band = EXCLUDED.risk_band,
            status = EXCLUDED.status,
            gym_id = EXCLUDED.gym_id;

        -- 4. Insertar Pagos
        DELETE FROM public.payments WHERE gym_id = v_gym_id;
        INSERT INTO public.payments (gym_id, member_id, amount, currency, method, paid_at, period_start, period_end, status, created_by)
        VALUES
            (v_gym_id, v_m_pedro, 34.00, 'USD', 'card', now() - interval '4 days', now() - interval '4 days', now() + interval '26 days', 'paid', v_roberto_id),
            (v_gym_id, v_m_tomas, 168.00, 'USD', 'card', now() - interval '5 days', now() - interval '5 days', now() + interval '175 days', 'paid', v_roberto_id),
            (v_gym_id, v_m_sofia, 34.00, 'USD', 'card', now() - interval '6 days', now() - interval '6 days', now() + interval '24 days', 'paid', v_roberto_id),
            (v_gym_id, v_m_juan, 34.00, 'USD', 'card', now() - interval '38 days', now() - interval '38 days', now() - interval '8 days', 'paid', v_roberto_id),
            (v_gym_id, v_m_juan, 34.00, 'USD', 'card', now() - interval '68 days', now() - interval '68 days', now() - interval '38 days', 'paid', v_roberto_id),
            (v_gym_id, v_m_juan, 34.00, 'USD', 'card', now() - interval '98 days', now() - interval '98 days', now() - interval '68 days', 'paid', v_roberto_id),
            (v_gym_id, v_m_mariana, 34.00, 'USD', 'cash', now(), now(), now() + interval '30 days', 'pending', v_roberto_id),
            (v_gym_id, v_m_camila, 92.00, 'USD', 'transfer', now(), now(), now() + interval '90 days', 'pending', v_roberto_id),
            (v_gym_id, v_m_juan, 34.00, 'USD', 'card', now(), now() - interval '5 days', now() + interval '25 days', 'failed', v_roberto_id);

        -- 5. Insertar Asistencias
        INSERT INTO public.attendances (gym_id, member_id, checked_in_at, source)
        SELECT v_gym_id, id, now() - (interval '1 hour' * floor(random() * 72)), 'staff'
        FROM public.members
        WHERE gym_id = v_gym_id;

    END IF;
END $$;
