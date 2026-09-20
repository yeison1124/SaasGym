/**
 * Script de Backup Local/Manual para GymPulse (Supabase Database)
 * Exporta esquema y datos a la carpeta local ./backups/
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

const DB_HOST = process.env.SUPABASE_DB_HOST || `db.${projectRef}.supabase.co`;
const DB_PORT = process.env.SUPABASE_DB_PORT || '5432';
const DB_USER = process.env.SUPABASE_DB_USER || 'postgres';
const DB_NAME = process.env.SUPABASE_DB_NAME || 'postgres';
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

async function runBackup() {
  console.log('====================================================');
  console.log('📦 Iniciando Backup de Base de Datos - GymPulse');
  console.log(`Proyecto Supabase: ${projectRef}`);
  console.log(`Host: ${DB_HOST}`);
  console.log('====================================================');

  const backupsDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(backupsDir, `backup_${projectRef}_${timestamp}.sql`);

  if (!DB_PASSWORD) {
    console.log('⚠️ AVISO: SUPABASE_DB_PASSWORD no está definida en .env.local.');
    console.log('Para ejecutar un pg_dump directo, añade SUPABASE_DB_PASSWORD=tu_password en .env.local.');
    console.log('Alternativamente, el backup automático se ejecuta diariamente en GitHub Actions.');
    return;
  }

  try {
    const cmd = `pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists --no-owner --no-privileges -f "${outputFile}"`;
    execSync(cmd, {
      env: { ...process.env, PGPASSWORD: DB_PASSWORD },
      stdio: 'inherit',
    });
    console.log(`\n✅ Backup guardado con éxito en: ${outputFile}`);
  } catch (err) {
    console.error('\n❌ Error al ejecutar el backup:', err.message);
  }
}

runBackup();
