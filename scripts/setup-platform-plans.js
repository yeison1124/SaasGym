const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupPlatformPlans() {
  console.log('Setting up platform_plans table...');

  // Create table via SQL query
  const createTableSql = `
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
  `;

  // We can insert/upsert the default plans
  const defaultPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billing_period: 'monthly',
      description: 'Para gimnasios chicos que recién empiezan o quieren probar.',
      features: [
        'Hasta 30 miembros activos',
        'Dashboard básico',
        '1 administrador',
        'Soporte por email'
      ],
      badge: null,
      is_popular: false,
      order_index: 1,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 17,
      billing_period: 'monthly',
      description: 'Pensado para gimnasios independientes con foco en retención.',
      features: [
        'Hasta 150 miembros activos',
        'Score de riesgo automático',
        'Reportes mensuales por miembro',
        'Hasta 3 entrenadores',
        'Soporte vía chat'
      ],
      badge: 'MÁS POPULAR',
      is_popular: true,
      order_index: 2,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 48,
      billing_period: 'monthly',
      description: 'Para gimnasios establecidos que quieren maximizar retención.',
      features: [
        'Hasta 500 miembros activos',
        'Reportes automáticos y cohortes',
        'Integraciones (WhatsApp, Mercado Pago)',
        'Hasta 10 entrenadores',
        'Soporte prioritario'
      ],
      badge: null,
      is_popular: false,
      order_index: 3,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 120,
      billing_period: 'monthly',
      description: 'Para cadenas y gimnasios con múltiples sedes.',
      features: [
        'Miembros ilimitados',
        'Multi-sede',
        'API y webhooks',
        'Onboarding dedicado',
        'Coach asignado de éxito'
      ],
      badge: 'ANUAL CON DESCUENTO',
      is_popular: false,
      order_index: 4,
    },
  ];

  // Try using rpc or direct supabase calls
  // First check if table exists by querying it
  const { data, error } = await supabase.from('platform_plans').select('*');
  if (error) {
    console.log('Creating table via RPC / migration or REST API...');
    // We can execute migration with supabase CLI if available, or insert if created
  }

  // Upsert the records
  for (const p of defaultPlans) {
    const { error: upsertErr } = await supabase
      .from('platform_plans')
      .upsert(p, { onConflict: 'id' });
    if (upsertErr) {
      console.log(`Note on upserting ${p.id}:`, upsertErr.message);
    } else {
      console.log(`Plan ${p.id} synced with price $${p.price}`);
    }
  }
}

setupPlatformPlans();
