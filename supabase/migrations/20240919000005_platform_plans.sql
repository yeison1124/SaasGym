-- Create platform_plans table
create table if not exists public.platform_plans (
  id text primary key,
  name text not null,
  price numeric not null default 0,
  billing_period text not null default 'monthly',
  description text not null,
  features jsonb not null default '[]'::jsonb,
  badge text,
  is_popular boolean default false,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.platform_plans enable row level security;

-- Public read policy
drop policy if exists "Anyone can read platform_plans" on public.platform_plans;
create policy "Anyone can read platform_plans"
  on public.platform_plans for select
  using (true);

-- SuperAdmin update policy
drop policy if exists "SuperAdmins can update platform_plans" on public.platform_plans;
create policy "SuperAdmins can update platform_plans"
  on public.platform_plans for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'superadmin'
    )
  );

-- Seed default plans
insert into public.platform_plans (id, name, price, billing_period, description, features, badge, is_popular, order_index)
values
  (
    'free',
    'Free',
    0,
    'monthly',
    'Para gimnasios chicos que recién empiezan o quieren probar.',
    '["Hasta 30 miembros activos", "Dashboard básico", "1 administrador", "Soporte por email"]'::jsonb,
    null,
    false,
    1
  ),
  (
    'starter',
    'Starter',
    17,
    'monthly',
    'Pensado para gimnasios independientes con foco en retención.',
    '["Hasta 150 miembros activos", "Score de riesgo automático", "Reportes mensuales por miembro", "Hasta 3 entrenadores", "Soporte vía chat"]'::jsonb,
    'MÁS POPULAR',
    true,
    2
  ),
  (
    'pro',
    'Pro',
    48,
    'monthly',
    'Para gimnasios establecidos que quieren maximizar retención.',
    '["Hasta 500 miembros activos", "Reportes automáticos y cohortes", "Integraciones (WhatsApp, Mercado Pago)", "Hasta 10 entrenadores", "Soporte prioritario"]'::jsonb,
    null,
    false,
    3
  ),
  (
    'enterprise',
    'Enterprise',
    120,
    'monthly',
    'Para cadenas y gimnasios con múltiples sedes.',
    '["Miembros ilimitados", "Multi-sede", "API y webhooks", "Onboarding dedicado", "Coach asignado de éxito"]'::jsonb,
    'ANUAL CON DESCUENTO',
    false,
    4
  )
on conflict (id) do update set
  name = excluded.name,
  price = excluded.price,
  description = excluded.description,
  features = excluded.features,
  badge = excluded.badge,
  is_popular = excluded.is_popular,
  order_index = excluded.order_index;
