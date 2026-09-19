-- ==============================================================================
-- GetGym SaaS: Migración para Registro Atómico de Owner + Gimnasio
-- ==============================================================================

-- 1. Función para generar slugs limpios
CREATE OR REPLACE FUNCTION public.slugify(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE STRICT
AS $$
    SELECT trim(BOTH '-' FROM lower(regexp_replace(value, '[^a-zA-Z0-9]+', '-', 'g')));
$$;

-- 2. Trigger mejorado para handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role user_role;
    v_gym_name TEXT;
    v_gym_id UUID;
    v_slug TEXT;
    v_full_name TEXT;
BEGIN
    v_role := COALESCE((new.raw_user_meta_data->>'role')::user_role, 'owner'::user_role);
    v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
    v_gym_name := COALESCE(new.raw_user_meta_data->>'gym_name', v_full_name || ' Gym');
    
    -- Si el rol es OWNER y no tiene gym_id previo asignado, creamos el Gimnasio atómicamente
    IF v_role = 'owner' THEN
        v_gym_id := (new.raw_user_meta_data->>'gym_id')::UUID;
        
        IF v_gym_id IS NULL THEN
            -- Generar slug único
            v_slug := public.slugify(v_gym_name) || '-' || substr(md5(random()::text), 1, 6);
            
            INSERT INTO public.gyms (
                name,
                slug,
                address,
                city,
                country,
                phone,
                plan,
                subscription_status,
                trial_ends_at
            ) VALUES (
                v_gym_name,
                v_slug,
                COALESCE(new.raw_user_meta_data->>'address', 'Sede Principal'),
                COALESCE(new.raw_user_meta_data->>'city', 'Medellín'),
                COALESCE(new.raw_user_meta_data->>'country', 'CO'),
                COALESCE(new.raw_user_meta_data->>'phone', ''),
                'starter'::gym_plan,
                'trialing'::gym_subscription_status,
                now() + interval '14 days'
            ) RETURNING id INTO v_gym_id;
        END IF;
    ELSIF v_role = 'superadmin' THEN
        v_gym_id := NULL;
    ELSE
        -- Trainer o Member asignado por invitación con gym_id en metadata
        v_gym_id := (new.raw_user_meta_data->>'gym_id')::UUID;
    END IF;

    -- Insertar el perfil del usuario vinculado al gimnasio
    INSERT INTO public.profiles (
        id,
        gym_id,
        role,
        full_name,
        email,
        phone,
        is_active
    ) VALUES (
        new.id,
        v_gym_id,
        v_role,
        v_full_name,
        new.email,
        new.raw_user_meta_data->>'phone',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        gym_id = COALESCE(public.profiles.gym_id, EXCLUDED.gym_id),
        role = EXCLUDED.role;

    RETURN new;
END;
$$;

-- Re-asociar el trigger a auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
