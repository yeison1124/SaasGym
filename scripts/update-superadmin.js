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

async function updateSuperAdmin() {
  console.log('Updating superadmin profile to Yeison Carreño...');
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: 'Yeison Carreño',
    })
    .eq('role', 'superadmin');

  if (error) {
    console.error('Error updating profile:', error);
  } else {
    console.log('Updated SuperAdmin successfully!');
  }
}

updateSuperAdmin();
