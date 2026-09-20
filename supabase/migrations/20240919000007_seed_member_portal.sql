-- ==============================================================================
-- GymPulse: Seed Data for Member Portal (María Jiménez - Iron Strength Medellín)
-- ==============================================================================

DO $$
DECLARE
    v_gym_id UUID := '5200c3fa-b18c-445d-883d-b28fa6b23ffe';
    v_member_user_id UUID := '77777777-7777-7777-7777-777777777777';
    v_maria_member_id UUID := '88888888-8888-8888-8888-888888888888';
    v_coach_carlos_id UUID := '99999999-9999-9999-9999-999999999999';
    v_coach_esteban_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    v_coach_lucia_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    v_routine_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    v_class_stretch UUID := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
    v_class_hiit1 UUID := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
    v_class_hiit2 UUID := 'ffffffff-ffff-ffff-ffff-ffffffffffff';
    v_class_yoga UUID := '11111111-2222-3333-4444-555555555555';
    v_class_crossfit UUID := '66666666-7777-8888-9999-000000000000';
BEGIN
    -- 1. Create/Ensure Auth User for María Jiménez
    DELETE FROM auth.users WHERE email = 'maria@ironstrength.co';
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
    ) VALUES (
        v_member_user_id,
        '00000000-0000-0000-0000-000000000000',
        'maria@ironstrength.co',
        crypt('Password123!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"María Jiménez","role":"member"}',
        now(),
        now(),
        'authenticated',
        'authenticated'
    );

    -- 2. Create Profile for María
    INSERT INTO public.profiles (id, gym_id, full_name, email, role)
    VALUES (v_member_user_id, v_gym_id, 'María Jiménez', 'maria@ironstrength.co', 'member')
    ON CONFLICT (id) DO UPDATE SET
        full_name = 'María Jiménez',
        gym_id = v_gym_id,
        role = 'member';

    -- 3. Create Coach Profiles if needed
    INSERT INTO public.profiles (id, gym_id, full_name, email, role)
    VALUES 
        (v_coach_carlos_id, v_gym_id, 'Carlos Rodríguez', 'carlos.rodriguez@ironstrength.co', 'trainer'),
        (v_coach_esteban_id, v_gym_id, 'Esteban Rivera', 'esteban.rivera@ironstrength.co', 'trainer'),
        (v_coach_lucia_id, v_gym_id, 'Lucía Galván', 'lucia.galvan@ironstrength.co', 'trainer')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- 4. Create Member record for María
    DELETE FROM public.members WHERE email = 'maria@ironstrength.co' OR id = v_maria_member_id;

    INSERT INTO public.members (
        id, gym_id, user_id, full_name, email, phone,
        status, risk_band, risk_score, joined_at, current_period_end,
        weight_kg, height_cm, birthdate
    ) VALUES (
        v_maria_member_id,
        v_gym_id,
        v_member_user_id,
        'María Jiménez',
        'maria@ironstrength.co',
        '+57 312 987 6543',
        'active',
        'saludable',
        15,
        now() - INTERVAL '120 days',
        now() + INTERVAL '45 days',
        60.0,
        168.0,
        '1993-04-12'
    );

    -- 5. Routine for María: "Hipertrofia 4 días"
    DELETE FROM public.routines WHERE id = v_routine_id;
    INSERT INTO public.routines (
        id, gym_id, name, description, level, days_per_week, created_by
    ) VALUES (
        v_routine_id,
        v_gym_id,
        'Hipertrofia 4 días',
        'Programa de hipertrofia para tren superior e inferior con énfasis en cadena posterior.',
        'intermedio',
        4,
        v_coach_carlos_id
    );

    -- Exercises for routine
    DELETE FROM public.routine_exercises WHERE routine_id = v_routine_id;
    INSERT INTO public.routine_exercises (
        routine_id, day_index, order_index, name, block_name,
        sets, reps, rest_seconds, weight_notes, video_url
    ) VALUES 
        (v_routine_id, 1, 1, 'Cinta a ritmo moderado', 'CALENTAMIENTO', 1, '5 min', 0, 'Zona 2', 'https://www.youtube.com/watch?v=kYv9qM-jH6s'),
        (v_routine_id, 1, 2, 'Activación de glúteo con banda', 'CALENTAMIENTO', 2, '12', 30, 'Banda media', 'https://www.youtube.com/watch?v=wX5yL_wA9q0'),
        (v_routine_id, 1, 3, 'Sentadilla con barra', 'BLOQUE PRINCIPAL', 4, '8', 90, '55 kg', 'https://www.youtube.com/watch?v=bEv6CCg2BC8'),
        (v_routine_id, 1, 4, 'Hip thrust', 'BLOQUE PRINCIPAL', 4, '10', 75, '60 kg', 'https://www.youtube.com/watch?v=SEdqd1n0cvg'),
        (v_routine_id, 1, 5, 'Peso muerto rumano', 'BLOQUE PRINCIPAL', 3, '10', 75, '45 kg', 'https://www.youtube.com/watch?v=JCXUYuzwNrM');

    -- Assign routine to María
    DELETE FROM public.member_routines WHERE member_id = v_maria_member_id;
    INSERT INTO public.member_routines (member_id, routine_id, assigned_by, is_active)
    VALUES (v_maria_member_id, v_routine_id, v_coach_carlos_id, true);

    -- 6. Classes for weekly schedule
    DELETE FROM public.classes WHERE gym_id = v_gym_id;
    INSERT INTO public.classes (id, gym_id, name, trainer_id, starts_at, ends_at, capacity)
    VALUES
        (v_class_stretch, v_gym_id, 'Stretching', v_coach_lucia_id, '2026-05-12 08:00:00+00', '2026-05-12 09:00:00+00', 15),
        (v_class_hiit1, v_gym_id, 'Funcional HIIT', v_coach_esteban_id, '2026-05-13 07:30:00+00', '2026-05-13 08:30:00+00', 20),
        (v_class_hiit2, v_gym_id, 'Funcional HIIT', v_coach_esteban_id, '2026-05-15 10:00:00+00', '2026-05-15 11:00:00+00', 20),
        (v_class_yoga, v_gym_id, 'Yoga flow', v_coach_lucia_id, '2026-05-16 09:00:00+00', '2026-05-16 10:00:00+00', 18),
        (v_class_crossfit, v_gym_id, 'CrossFit open', v_coach_esteban_id, '2026-05-17 11:00:00+00', '2026-05-17 12:00:00+00', 25);

    -- Bookings for María (Reserved for Funcional HIIT on May 15)
    DELETE FROM public.class_bookings WHERE member_id = v_maria_member_id;
    INSERT INTO public.class_bookings (gym_id, class_id, member_id, status)
    VALUES (v_gym_id, v_class_hiit2, v_maria_member_id, 'booked');

    -- 7. Progress entries (Weight evolution from 67.5kg down to 60.0kg)
    DELETE FROM public.progress_entries WHERE member_id = v_maria_member_id;
    INSERT INTO public.progress_entries (gym_id, member_id, recorded_at, weight_kg, notes)
    VALUES
        (v_gym_id, v_maria_member_id, '2026-02-01 10:00:00+00', 67.5, 'Inicio del programa'),
        (v_gym_id, v_maria_member_id, '2026-03-01 10:00:00+00', 65.0, 'Mes 1 completado'),
        (v_gym_id, v_maria_member_id, '2026-04-01 10:00:00+00', 63.5, 'Excelente constancia'),
        (v_gym_id, v_maria_member_id, '2026-05-01 10:00:00+00', 61.2, 'Definición'),
        (v_gym_id, v_maria_member_id, '2026-05-15 10:00:00+00', 60.0, 'Meta alcanzada (-7.5kg)');

    -- 8. Community posts
    DELETE FROM public.posts WHERE gym_id = v_gym_id;
    INSERT INTO public.posts (gym_id, author_id, content, photo_url, likes_count, created_at)
    VALUES
        (
            v_gym_id,
            v_member_user_id,
            'hola',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
            14,
            now() - INTERVAL '23 hours'
        );

    -- 9. Achievements Catalog & Unlocked
    INSERT INTO public.achievements (code, name, description, icon, threshold)
    VALUES
        ('first_workout', 'Primer Entrenamiento', 'Completaste tu primera sesión en el gimnasio', 'Zap', 1),
        ('streak_3', 'Racha de 3 Días', '3 días seguidos entrenando sin parar', 'Flame', 3),
        ('streak_7', 'Semana Perfecta', '7 días consecutivos de entrenamiento', 'Award', 7),
        ('weight_loss_5', 'Transformación -5kg', 'Superaste los 5kg de reducción saludable', 'TrendingDown', 5),
        ('strength_titan', 'Titán de Sentadilla', 'Levantaste más de tu peso corporal', 'Dumbbell', 1)
    ON CONFLICT (code) DO NOTHING;

    DELETE FROM public.member_achievements WHERE member_id = v_maria_member_id;
    INSERT INTO public.member_achievements (gym_id, member_id, achievement_code, unlocked_at)
    VALUES
        (v_gym_id, v_maria_member_id, 'first_workout', now() - INTERVAL '60 days'),
        (v_gym_id, v_maria_member_id, 'streak_3', now() - INTERVAL '2 days'),
        (v_gym_id, v_maria_member_id, 'weight_loss_5', now() - INTERVAL '10 days'),
        (v_gym_id, v_maria_member_id, 'strength_titan', now() - INTERVAL '15 days');

END $$;
