-- ==============================================================================
-- GetGym SaaS: Corrección de Políticas RLS para evitar recursión en profiles
-- ==============================================================================

-- 1. Asegurar permisos en esquemas
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Recrear funciones de ayuda con ejecución directa sin bucles
CREATE OR REPLACE FUNCTION public.auth_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.auth_gym_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT gym_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 3. Reemplazar políticas de PROFILES
DROP POLICY IF EXISTS "profiles_superadmin_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_gym_staff_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_read_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_all" ON public.profiles;

-- El usuario siempre puede leer y modificar su propio perfil
CREATE POLICY "profiles_self_all" ON public.profiles
    FOR ALL TO authenticated 
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Lectura de miembros del mismo gimnasio
CREATE POLICY "profiles_gym_read" ON public.profiles
    FOR SELECT TO authenticated 
    USING (
        gym_id IS NOT NULL AND 
        gym_id = public.auth_gym_id()
    );

-- SuperAdmin acceso total
CREATE POLICY "profiles_superadmin_all" ON public.profiles
    FOR ALL TO authenticated 
    USING (public.auth_role() = 'superadmin');

-- 4. Reemplazar políticas de GYMS
DROP POLICY IF EXISTS "gyms_superadmin_all" ON public.gyms;
DROP POLICY IF EXISTS "gyms_owner_read_update" ON public.gyms;
DROP POLICY IF EXISTS "gyms_members_trainers_read" ON public.gyms;

CREATE POLICY "gyms_superadmin_all" ON public.gyms
    FOR ALL TO authenticated 
    USING (public.auth_role() = 'superadmin');

CREATE POLICY "gyms_tenant_access" ON public.gyms
    FOR ALL TO authenticated 
    USING (id = public.auth_gym_id());
