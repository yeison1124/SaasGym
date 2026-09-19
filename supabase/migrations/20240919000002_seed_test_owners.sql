-- ==============================================================================
-- GetGym SaaS: Creación de 3 Owners de Prueba y sus 3 Gimnasios
-- Para probar aislamiento Multi-Tenant y Login directo
-- Contraseña para todos: Password123!
-- ==============================================================================

DO $$
DECLARE
    -- Hash bcrypt de 'Password123!'
    v_encrypted_password TEXT := '$2a$10$tZ26d6aUu8l.pQOqT9k1d.58P.p4GvD8H08N.Xm0rR3V7b1v5dJeu';
    
    -- IDs de Gimnasios
    v_gym_iron UUID := 'a0000000-0000-0000-0000-000000000001';
    v_gym_elite UUID := 'a0000000-0000-0000-0000-000000000002';
    v_gym_power UUID := 'a0000000-0000-0000-0000-000000000003';

    -- IDs de Usuarios
    v_user_roberto UUID := 'b0000000-0000-0000-0000-000000000001';
    v_user_diego UUID := 'b0000000-0000-0000-0000-000000000002';
    v_user_laura UUID := 'b0000000-0000-0000-0000-000000000003';
    v_user_superadmin UUID := 'b0000000-0000-0000-0000-000000000000';
BEGIN
    -- Si la extensión pgcrypto está disponible en extensions
    BEGIN
        v_encrypted_password := extensions.crypt('Password123!', extensions.gen_salt('bf'));
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- 1. Insertar / Actualizar los 3 Gimnasios
    INSERT INTO public.gyms (id, name, slug, address, city, country, phone, plan, subscription_status, trial_ends_at)
    VALUES 
    (
        v_gym_iron,
        'Iron Strength Medellín',
        'iron-strength-medellin',
        'Cra 43A #1-50, El Poblado',
        'Medellín',
        'CO',
        '+57 300 123 4567',
        'pro',
        'active',
        now() + interval '30 days'
    ),
    (
        v_gym_elite,
        'Élite Performance',
        'elite-performance-mty',
        'Av. San Pedro 400',
        'Monterrey',
        'MX',
        '+52 81 8356 0000',
        'starter',
        'active',
        now() + interval '30 days'
    ),
    (
        v_gym_power,
        'Power Hub Buenos Aires',
        'power-hub-ba',
        'Av. Cabildo 2040, Belgrano',
        'Buenos Aires',
        'AR',
        '+54 11 4781 0000',
        'starter',
        'trialing',
        now() + interval '14 days'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        plan = EXCLUDED.plan,
        subscription_status = EXCLUDED.subscription_status;

    -- 2. Insertar / Actualizar Usuarios en auth.users
    -- Usuario SuperAdmin: nico@getgym.app
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        v_user_superadmin,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'nico@getgym.app',
        v_encrypted_password,
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"role":"superadmin","full_name":"Nico Sosa (SuperAdmin)"}',
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = now(),
        raw_user_meta_data = EXCLUDED.raw_user_meta_data;

    -- Owner 1: roberto@ironstrength.co
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        v_user_roberto,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'roberto@ironstrength.co',
        v_encrypted_password,
        now(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('role', 'owner', 'full_name', 'Roberto Martínez', 'gym_id', v_gym_iron, 'gym_name', 'Iron Strength Medellín'),
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = now(),
        raw_user_meta_data = EXCLUDED.raw_user_meta_data;

    -- Owner 2: diego@elitegym.mx
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        v_user_diego,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'diego@elitegym.mx',
        v_encrypted_password,
        now(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('role', 'owner', 'full_name', 'Diego Cuevas', 'gym_id', v_gym_elite, 'gym_name', 'Élite Performance'),
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = now(),
        raw_user_meta_data = EXCLUDED.raw_user_meta_data;

    -- Owner 3: laura@powerhub.ar
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        v_user_laura,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'laura@powerhub.ar',
        v_encrypted_password,
        now(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('role', 'owner', 'full_name', 'Laura Giménez', 'gym_id', v_gym_power, 'gym_name', 'Power Hub Buenos Aires'),
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = now(),
        raw_user_meta_data = EXCLUDED.raw_user_meta_data;

    -- 3. Asegurar los registros en public.profiles
    INSERT INTO public.profiles (id, gym_id, role, full_name, email, is_active)
    VALUES
    (v_user_superadmin, NULL, 'superadmin', 'Nico Sosa (SuperAdmin)', 'nico@getgym.app', true),
    (v_user_roberto, v_gym_iron, 'owner', 'Roberto Martínez', 'roberto@ironstrength.co', true),
    (v_user_diego, v_gym_elite, 'owner', 'Diego Cuevas', 'diego@elitegym.mx', true),
    (v_user_laura, v_gym_power, 'owner', 'Laura Giménez', 'laura@powerhub.ar', true)
    ON CONFLICT (id) DO UPDATE SET
        gym_id = EXCLUDED.gym_id,
        role = EXCLUDED.role,
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;

END $$;
