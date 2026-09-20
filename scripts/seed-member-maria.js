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

const GYM_ID = '5200c3fa-b18c-445d-883d-b28fa6b23ffe'; // Roberto's gym

async function seedMariaMember() {
  console.log('Seeding Maria Jimenez in gym:', GYM_ID);

  // 1. Find or create Auth User for maria@ironstrength.co
  let mariaUserId = null;
  const { data: userList } = await supabase.auth.admin.listUsers();
  const existingUser = userList?.users?.find(u => u.email === 'maria@ironstrength.co');

  if (existingUser) {
    mariaUserId = existingUser.id;
    console.log('Found existing auth user:', mariaUserId);
    await supabase.auth.admin.updateUserById(mariaUserId, {
      password: 'Password123!',
      user_metadata: { full_name: 'María Jiménez', role: 'member' }
    });
  } else {
    const { data: newUser } = await supabase.auth.admin.createUser({
      email: 'maria@ironstrength.co',
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { full_name: 'María Jiménez', role: 'member' }
    });
    mariaUserId = newUser?.user?.id;
    console.log('Created auth user:', mariaUserId);
  }

  // 2. Profile for Maria
  if (mariaUserId) {
    await supabase.from('profiles').upsert({
      id: mariaUserId,
      gym_id: GYM_ID,
      full_name: 'María Jiménez',
      email: 'maria@ironstrength.co',
      role: 'member'
    });
  }

  // 3. Member record
  const memberId = '88888888-8888-8888-8888-888888888888';
  const { error: memErr } = await supabase.from('members').upsert({
    id: memberId,
    gym_id: GYM_ID,
    user_id: mariaUserId,
    full_name: 'María Jiménez',
    email: 'maria@ironstrength.co',
    phone: '+57 312 987 6543',
    status: 'active',
    risk_band: 'saludable',
    risk_score: 15,
    weight_kg: 60.0,
    height_cm: 168.0,
    current_period_end: new Date(Date.now() + 45 * 86400000).toISOString()
  });
  if (memErr) console.error('Member error:', memErr);

  // 4. Routine "Hipertrofia 4 días"
  const routineId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  await supabase.from('routines').upsert({
    id: routineId,
    gym_id: GYM_ID,
    name: 'Hipertrofia 4 días',
    description: 'Programa de hipertrofia para tren superior e inferior con énfasis en cadena posterior.',
    level: 'intermedio',
    days_per_week: 4,
    created_by: 'f69ed04d-f974-4229-b49d-5d267e4f9f7f' // Roberto's profile
  });

  // Exercises
  await supabase.from('routine_exercises').delete().eq('routine_id', routineId);
  await supabase.from('routine_exercises').insert([
    {
      routine_id: routineId,
      day_index: 1,
      order_index: 1,
      name: 'Cinta a ritmo moderado',
      block_name: 'CALENTAMIENTO',
      sets: 1,
      reps: '5 min',
      rest_seconds: 0,
      weight_notes: 'Z2',
      video_url: 'https://www.youtube.com/watch?v=kYv9qM-jH6s'
    },
    {
      routine_id: routineId,
      day_index: 1,
      order_index: 2,
      name: 'Activación de glúteo con banda',
      block_name: 'CALENTAMIENTO',
      sets: 2,
      reps: '12',
      rest_seconds: 30,
      weight_notes: 'Banda media',
      video_url: 'https://www.youtube.com/watch?v=wX5yL_wA9q0'
    },
    {
      routine_id: routineId,
      day_index: 1,
      order_index: 3,
      name: 'Sentadilla con barra',
      block_name: 'BLOQUE PRINCIPAL',
      sets: 4,
      reps: '8',
      rest_seconds: 90,
      weight_notes: '55 kg',
      video_url: 'https://www.youtube.com/watch?v=bEv6CCg2BC8'
    },
    {
      routine_id: routineId,
      day_index: 1,
      order_index: 4,
      name: 'Hip thrust',
      block_name: 'BLOQUE PRINCIPAL',
      sets: 4,
      reps: '10',
      rest_seconds: 75,
      weight_notes: '60 kg',
      video_url: 'https://www.youtube.com/watch?v=SEdqd1n0cvg'
    },
    {
      routine_id: routineId,
      day_index: 1,
      order_index: 5,
      name: 'Peso muerto rumano',
      block_name: 'BLOQUE PRINCIPAL',
      sets: 3,
      reps: '10',
      rest_seconds: 75,
      weight_notes: '45 kg',
      video_url: 'https://www.youtube.com/watch?v=JCXUYuzwNrM'
    }
  ]);

  // Assign routine to Maria
  await supabase.from('member_routines').upsert({
    member_id: memberId,
    routine_id: routineId,
    assigned_by: 'f69ed04d-f974-4229-b49d-5d267e4f9f7f',
    is_active: true
  });

  // 5. Progress entries
  await supabase.from('progress_entries').delete().eq('member_id', memberId);
  await supabase.from('progress_entries').insert([
    { gym_id: GYM_ID, member_id: memberId, recorded_at: '2026-02-01T10:00:00Z', weight_kg: 67.5, notes: 'Inicio' },
    { gym_id: GYM_ID, member_id: memberId, recorded_at: '2026-03-01T10:00:00Z', weight_kg: 65.0, notes: 'Mes 1' },
    { gym_id: GYM_ID, member_id: memberId, recorded_at: '2026-04-01T10:00:00Z', weight_kg: 63.5, notes: 'Mes 2' },
    { gym_id: GYM_ID, member_id: memberId, recorded_at: '2026-05-01T10:00:00Z', weight_kg: 61.2, notes: 'Mes 3' },
    { gym_id: GYM_ID, member_id: memberId, recorded_at: '2026-05-15T10:00:00Z', weight_kg: 60.0, notes: 'Meta -7.5kg' }
  ]);

  // 6. Classes
  await supabase.from('classes').delete().eq('gym_id', GYM_ID);
  const { data: insertedClasses } = await supabase.from('classes').insert([
    {
      gym_id: GYM_ID,
      name: 'Stretching',
      trainer_id: 'f69ed04d-f974-4229-b49d-5d267e4f9f7f',
      starts_at: '2026-05-12T08:00:00Z',
      ends_at: '2026-05-12T09:00:00Z',
      capacity: 15
    },
    {
      gym_id: GYM_ID,
      name: 'Funcional HIIT',
      trainer_id: 'f69ed04d-f974-4229-b49d-5d267e4f9f7f',
      starts_at: '2026-05-13T07:30:00Z',
      ends_at: '2026-05-13T08:30:00Z',
      capacity: 20
    },
    {
      gym_id: GYM_ID,
      name: 'Funcional HIIT',
      trainer_id: 'f69ed04d-f974-4229-b49d-5d267e4f9f7f',
      starts_at: '2026-05-15T10:00:00Z',
      ends_at: '2026-05-15T11:00:00Z',
      capacity: 20
    },
    {
      gym_id: GYM_ID,
      name: 'Yoga flow',
      trainer_id: 'f69ed04d-f974-4229-b49d-5d267e4f9f7f',
      starts_at: '2026-05-16T09:00:00Z',
      ends_at: '2026-05-16T10:00:00Z',
      capacity: 18
    },
    {
      gym_id: GYM_ID,
      name: 'CrossFit open',
      trainer_id: 'f69ed04d-f974-4229-b49d-5d267e4f9f7f',
      starts_at: '2026-05-17T11:00:00Z',
      ends_at: '2026-05-17T12:00:00Z',
      capacity: 25
    }
  ]).select();

  // Book class for Maria (Friday 15 May Funcional HIIT)
  const hiitMay15 = insertedClasses?.find(c => c.starts_at?.includes('2026-05-15'));
  if (hiitMay15) {
    await supabase.from('class_bookings').delete().eq('member_id', memberId);
    await supabase.from('class_bookings').insert({
      gym_id: GYM_ID,
      class_id: hiitMay15.id,
      member_id: memberId,
      status: 'booked'
    });
  }

  // 7. Community Posts
  await supabase.from('posts').delete().eq('gym_id', GYM_ID);
  if (mariaUserId) {
    await supabase.from('posts').insert({
      gym_id: GYM_ID,
      author_id: mariaUserId,
      content: 'hola',
      photo_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      likes_count: 14,
      created_at: new Date(Date.now() - 23 * 3600000).toISOString()
    });
  }

  console.log('✅ Maria Jimenez seeded successfully for gym:', GYM_ID);
}

seedMariaMember().catch(console.error);
