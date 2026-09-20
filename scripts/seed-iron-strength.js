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

const GYM_ID = 'a0000000-0000-0000-0000-000000000001'; // Iron Strength

async function seedIronStrength() {
  console.log('Seeding Iron Strength gym data...');

  // 1. Create Trainers in profiles if not existing
  const trainers = [
    { id: 'c0000000-0000-0000-0000-000000000001', full_name: 'Carlos Rodríguez', email: 'carlos@ironstrength.co', role: 'trainer', gym_id: GYM_ID },
    { id: 'c0000000-0000-0000-0000-000000000002', full_name: 'Camila Pérez', email: 'camila.perez@ironstrength.co', role: 'trainer', gym_id: GYM_ID },
    { id: 'c0000000-0000-0000-0000-000000000003', full_name: 'Esteban Rivera', email: 'esteban@ironstrength.co', role: 'trainer', gym_id: GYM_ID },
    { id: 'c0000000-0000-0000-0000-000000000004', full_name: 'Lucía Galván', email: 'lucia@ironstrength.co', role: 'trainer', gym_id: GYM_ID },
    { id: 'c0000000-0000-0000-0000-000000000005', full_name: 'Nicolás Sosa', email: 'staff@ironstrength.co', role: 'trainer', gym_id: GYM_ID },
  ];

  for (const t of trainers) {
    const { error } = await supabase.from('profiles').upsert(t, { onConflict: 'id' });
    if (error) console.log('Trainer upsert:', error.message);
  }

  // 2. Create Routines
  const routines = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      gym_id: GYM_ID,
      name: 'Hipertrofia 4 días',
      description: 'Enfoque en ganancia de masa muscular y fuerza base.',
      level: 'avanzado',
      days_per_week: 2,
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      gym_id: GYM_ID,
      name: 'Cardio HIIT 30 min',
      description: 'Entrenamiento por intervalos de alta intensidad para quema calórica.',
      level: 'intermedio',
      days_per_week: 3,
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      gym_id: GYM_ID,
      name: 'Tren inferior mujer',
      description: 'Rutina focalizada en glúteos, femorales y cuádriceps.',
      level: 'intermedio',
      days_per_week: 3,
    },
    {
      id: 'd0000000-0000-0000-0000-000000000004',
      gym_id: GYM_ID,
      name: 'Full body principiante',
      description: 'Adaptación neuromuscular integral para nuevos miembros.',
      level: 'principiante',
      days_per_week: 3,
    },
    {
      id: 'd0000000-0000-0000-0000-000000000005',
      gym_id: GYM_ID,
      name: 'Recuperación activa',
      description: 'Movilidad articular, estiramientos dinámicos y descarga muscular.',
      level: 'principiante',
      days_per_week: 2,
    },
  ];

  for (const r of routines) {
    const { error } = await supabase.from('routines').upsert(r, { onConflict: 'id' });
    if (error) console.log('Routine upsert:', error.message);
  }

  // 3. Create Routine Exercises
  const exercises = [
    {
      routine_id: 'd0000000-0000-0000-0000-000000000001',
      day_index: 1,
      order_index: 1,
      exercise_name: 'Press de banca plano con barra',
      sets: 4,
      reps: '8-10',
      rest_seconds: 90,
      video_url: 'https://youtube.com/watch?v=example1',
    },
    {
      routine_id: 'd0000000-0000-0000-0000-000000000001',
      day_index: 1,
      order_index: 2,
      exercise_name: 'Sentadilla trasera con barra',
      sets: 4,
      reps: '6-8',
      rest_seconds: 120,
      video_url: 'https://youtube.com/watch?v=example2',
    },
  ];

  for (const ex of exercises) {
    const { error } = await supabase.from('routine_exercises').upsert(ex);
    if (error) console.log('Exercise upsert:', error.message);
  }

  // 4. Create Members
  const now = new Date();
  const members = [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      gym_id: GYM_ID,
      full_name: 'Juan Pablo Díaz',
      email: 'juan.rios@example.com',
      phone: '+57 310 987 6543',
      goal: 'Ganancia muscular',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 6, 10).toISOString(),
      status: 'churned',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000001',
      risk_score: 92,
      risk_band: 'en_riesgo',
      last_attendance_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      gym_id: GYM_ID,
      full_name: 'Daniela Castro',
      email: 'daniela.castro@example.com',
      phone: '+57 311 234 5678',
      goal: 'Pérdida de grasa',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 5, 15).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000002',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000003',
      risk_score: 64,
      risk_band: 'atencion',
      last_attendance_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 20 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      gym_id: GYM_ID,
      full_name: 'Mariana Soto',
      email: 'mariana.soto@example.com',
      phone: '+57 312 345 6789',
      goal: 'Tonificación',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 10, 1).toISOString(),
      status: 'paused',
      assigned_trainer_id: null,
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000002',
      risk_score: 50,
      risk_band: 'atencion',
      last_attendance_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 5 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      gym_id: GYM_ID,
      full_name: 'Andrés Suárez',
      email: 'andres.suarez@example.com',
      phone: '+57 313 456 7890',
      goal: 'Rendimiento deportivo',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 4, 20).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000001',
      risk_score: 21,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000005',
      gym_id: GYM_ID,
      full_name: 'Florencia Méndez',
      email: 'florencia.mendez@example.com',
      phone: '+57 314 567 8901',
      goal: 'Salud y bienestar',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 3, 5).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000002',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000004',
      risk_score: 18,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() - 2 * 86400000).toISOString(), // Atrasado
    },
    {
      id: 'e0000000-0000-0000-0000-000000000006',
      gym_id: GYM_ID,
      full_name: 'Mauricio Toro',
      email: 'mauricio.toro@example.com',
      phone: '+57 315 678 9012',
      goal: 'Hipertrofia',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 8, 12).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000003',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000001',
      risk_score: 15,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000007',
      gym_id: GYM_ID,
      full_name: 'Tomás Rivera',
      email: 'tomas.rivera@example.com',
      phone: '+57 316 789 0123',
      goal: 'Fuerza',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000002',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000001',
      risk_score: 3,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 120 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000008',
      gym_id: GYM_ID,
      full_name: 'Sofía Romero',
      email: 'sofia.romero@example.com',
      phone: '+57 317 890 1234',
      goal: 'Fitness',
      joined_at: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000002',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000003',
      risk_score: 10,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 25 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000009',
      gym_id: GYM_ID,
      full_name: 'Pedro González',
      email: 'pedro.gonzalez@example.com',
      phone: '+57 318 901 2345',
      goal: 'Masa muscular',
      joined_at: new Date(now.getFullYear(), now.getMonth(), 2).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000001',
      risk_score: 8,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 28 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000010',
      gym_id: GYM_ID,
      full_name: 'Camila Vega',
      email: 'camila.vega@example.com',
      phone: '+57 319 012 3456',
      goal: 'Pérdida de peso',
      joined_at: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000002',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000003',
      risk_score: 12,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 60 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000011',
      gym_id: GYM_ID,
      full_name: 'Lucas Benítez',
      email: 'lucas.benitez@example.com',
      phone: '+57 320 123 4567',
      goal: 'Fuerza',
      joined_at: new Date(now.getFullYear(), now.getMonth(), 8).toISOString(),
      status: 'active',
      assigned_trainer_id: 'c0000000-0000-0000-0000-000000000003',
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000001',
      risk_score: 5,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 26 * 86400000).toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000012',
      gym_id: GYM_ID,
      full_name: 'Mateo Silva',
      email: 'mateo.silva@example.com',
      phone: '+57 321 234 5678',
      goal: 'Acondicionamiento',
      joined_at: new Date(now.getFullYear(), now.getMonth(), 12).toISOString(),
      status: 'active',
      assigned_trainer_id: null,
      assigned_routine_id: 'd0000000-0000-0000-0000-000000000004',
      risk_score: 4,
      risk_band: 'saludable',
      last_attendance_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      membership_expires_at: new Date(Date.now() + 29 * 86400000).toISOString(),
    },
  ];

  for (const m of members) {
    const { error } = await supabase.from('members').upsert(m, { onConflict: 'id' });
    if (error) console.log('Member upsert:', error.message);
  }

  // 5. Create Payments
  const payments = [
    {
      gym_id: GYM_ID,
      member_id: 'e0000000-0000-0000-0000-000000000009', // Pedro González
      amount: 34,
      currency: 'USD',
      method: 'card',
      status: 'paid',
      description: 'Mensualidad junio',
      paid_at: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
    },
    {
      gym_id: GYM_ID,
      member_id: 'e0000000-0000-0000-0000-000000000007', // Tomás Rivera
      amount: 168,
      currency: 'USD',
      method: 'card',
      status: 'paid',
      description: 'Semestral',
      paid_at: new Date(now.getFullYear(), now.getMonth(), 14).toISOString(),
    },
    {
      gym_id: GYM_ID,
      member_id: 'e0000000-0000-0000-0000-000000000008', // Sofía Romero
      amount: 34,
      currency: 'USD',
      method: 'card',
      status: 'paid',
      description: 'Mensualidad junio',
      paid_at: new Date(now.getFullYear(), now.getMonth(), 13).toISOString(),
    },
    {
      gym_id: GYM_ID,
      member_id: 'e0000000-0000-0000-0000-000000000001', // Juan Pablo Díaz
      amount: 34,
      currency: 'USD',
      method: 'card',
      status: 'paid',
      description: 'Mensualidad mayo',
      paid_at: new Date(now.getFullYear(), now.getMonth() - 1, 11).toISOString(),
    },
    {
      gym_id: GYM_ID,
      member_id: 'e0000000-0000-0000-0000-000000000003', // Mariana Soto
      amount: 34,
      currency: 'USD',
      method: 'cash',
      status: 'pending',
      description: 'Mensualidad junio',
      paid_at: null,
    },
    {
      gym_id: GYM_ID,
      member_id: 'e0000000-0000-0000-0000-000000000010', // Camila Vega
      amount: 92,
      currency: 'USD',
      method: 'transfer',
      status: 'pending',
      description: 'Trimestral junio-agosto',
      paid_at: null,
    },
    {
      gym_id: GYM_ID,
      member_id: 'e0000000-0000-0000-0000-000000000001', // Juan Pablo Díaz
      amount: 34,
      currency: 'USD',
      method: 'card',
      status: 'failed',
      description: 'Mensualidad junio',
      paid_at: null,
    },
  ];

  for (const p of payments) {
    const { error } = await supabase.from('payments').insert(p);
    if (error) console.log('Payment insert:', error.message);
  }

  // 6. Create Attendances
  const attendances = [];
  for (let i = 0; i < 25; i++) {
    const randomMember = members[Math.floor(Math.random() * members.length)];
    attendances.push({
      gym_id: GYM_ID,
      member_id: randomMember.id,
      checked_in_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)).toISOString(),
      source: 'staff',
    });
  }

  for (const att of attendances) {
    await supabase.from('attendances').insert(att);
  }

  console.log('Seeded Iron Strength with members, trainers, routines, exercises, payments and attendances!');
}

seedIronStrength();
