const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

const GYM_ID = '5200c3fa-b18c-445d-883d-b28fa6b23ffe';

async function main() {
  console.log('Seeding Maria for Gym:', GYM_ID);

  // 1. Get or Create Auth User
  let mariaUserId = null;
  const { data: userList } = await supabase.auth.admin.listUsers();
  const existingUser = userList?.users?.find(u => u.email === 'maria@ironstrength.co');

  if (existingUser) {
    mariaUserId = existingUser.id;
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
  }

  // 2. Profile
  await supabase.from('profiles').upsert({
    id: mariaUserId,
    gym_id: GYM_ID,
    full_name: 'María Jiménez',
    email: 'maria@ironstrength.co',
    role: 'member'
  });

  // 3. Member
  const { error: memErr } = await supabase.from('members').upsert({
    id: '88888888-8888-8888-8888-888888888888',
    gym_id: GYM_ID,
    profile_id: mariaUserId,
    full_name: 'María Jiménez',
    email: 'maria@ironstrength.co',
    phone: '+57 312 987 6543',
    status: 'active',
    risk_band: 'saludable',
    risk_score: 15,
    birth_date: '1993-04-12',
    goal: 'Hipertrofia y Tonificación',
    assigned_routine_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    membership_expires_at: '2026-12-31T23:59:59Z'
  });

  if (memErr) console.log('Member error:', memErr);
  else console.log('✅ Member Maria Jiménez created successfully in Supabase!');
}

main().catch(console.error);
