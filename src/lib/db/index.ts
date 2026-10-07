import { createClient } from '@libsql/client/node';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const rawDbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'app.db');
const dbDir = path.dirname(rawDbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const fileUrl = rawDbPath.startsWith('file:')
  ? rawDbPath
  : `file:${path.resolve(rawDbPath)}`;

export const sqliteClient = createClient({
  url: fileUrl,
});

// Enable WAL mode & foreign keys on connection
sqliteClient.execute('PRAGMA journal_mode = WAL;');
sqliteClient.execute('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqliteClient, { schema });
