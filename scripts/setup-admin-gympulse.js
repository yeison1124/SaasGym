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

async function setupSuperAdmin() {
  console.log('Setting up admin@gympulse.com as SuperAdmin...');

  const { data: userList } = await supabase.auth.admin.listUsers();
  let adminUser = userList?.users?.find(u => u.email === 'admin@gympulse.com');

  if (adminUser) {
    console.log('Found existing admin@gympulse.com, updating password to Admin123456!...');
    await supabase.auth.admin.updateUserById(adminUser.id, {
      password: 'Admin123456!',
      email_confirm: true,
      user_metadata: { full_name: 'Yeison Carreño', role: 'superadmin' }
    });
  } else {
    console.log('Creating new admin@gympulse.com with password Admin123456!...');
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email: 'admin@gympulse.com',
      password: 'Admin123456!',
      email_confirm: true,
      user_metadata: { full_name: 'Yeison Carreño', role: 'superadmin' }
    });
    if (error) console.error('Error creating user:', error);
    adminUser = newUser?.user;
  }

  if (adminUser) {
    console.log('Upserting profile for admin id:', adminUser.id);
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: adminUser.id,
      full_name: 'Yeison Carreño',
      email: 'admin@gympulse.com',
      role: 'superadmin',
      is_active: true
    });
    if (profErr) console.error('Profile error:', profErr);
    else console.log('✅ SuperAdmin admin@gympulse.com successfully created and ready!');
  }
}

setupSuperAdmin().catch(console.error);
