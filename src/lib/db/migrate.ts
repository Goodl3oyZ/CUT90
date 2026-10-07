import { sqliteClient } from './index';
import path from 'path';
import fs from 'fs';

export async function runMigrations() {
  const sqlPath = path.join(process.cwd(), 'migrations', '0000_initial.sql');
  if (fs.existsSync(sqlPath)) {
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    await sqliteClient.executeMultiple(sqlContent);
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Database migrations applied successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
