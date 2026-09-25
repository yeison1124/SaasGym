const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar definidos en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testUsers = [
  {
    email: 'nico@getgym.app',
    password: 'Password123!',
    user_metadata: {
      role: 'superadmin',
      full_name: 'Nico Sosa (SuperAdmin)',
    },
  },
  {
    email: 'roberto@ironstrength.co',
    password: 'Password123!',
    user_metadata: {
      role: 'owner',
      full_name: 'Roberto Martínez',
      gym_name: 'Iron Strength Medellín',
      city: 'Medellín',
      country: 'CO',
      phone: '+57 300 123 4567',
    },
  },
  {
    email: 'diego@elitegym.mx',
    password: 'Password123!',
    user_metadata: {
      role: 'owner',
      full_name: 'Diego Cuevas',
      gym_name: 'Élite Performance',
      city: 'Monterrey',
      country: 'MX',
      phone: '+52 81 8356 0000',
    },
  },
  {
    email: 'laura@powerhub.ar',
    password: 'Password123!',
    user_metadata: {
      role: 'owner',
      full_name: 'Laura Giménez',
      gym_name: 'Power Hub Buenos Aires',
      city: 'Buenos Aires',
      country: 'AR',
      phone: '+54 11 4781 0000',
    },
  },
];

async function seed() {
  console.log('--- Creando usuarios de prueba con Supabase Admin API ---');

  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.user_metadata,
      });

      if (error) {
        console.error(`Error al crear ${user.email}:`, error.message);
      } else {
        console.log(`✅ Creado con éxito: ${user.email} (ID: ${data.user.id})`);
      }
    } catch (err) {
      console.error(`Excepción al crear ${user.email}:`, err);
    }
  }

  console.log('--- Seeding completado ---');
}

seed();
