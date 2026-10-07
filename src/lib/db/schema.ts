import {
  check,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // sha256 hash of token
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const profiles = sqliteTable('profiles', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  sex: text('sex').$type<'male' | 'female'>().notNull(),
  age: integer('age').notNull(),
  heightCm: real('height_cm').notNull(),
  startWeight: real('start_weight').notNull(),
  goalWeight: real('goal_weight').notNull(),
  activity: text('activity')
    .$type<'sedentary' | 'lightly' | 'moderately' | 'very' | 'extremely'>()
    .notNull(),
  startDate: text('start_date').notNull(),
  proteinGPerKg: real('protein_g_per_kg').notNull().default(2.1),
  fatGPerKg: real('fat_g_per_kg').notNull().default(0.8),
  recalDay: integer('recal_day'),
  recalWeight: real('recal_weight'),
  updatedAt: integer('updated_at').notNull(),
});

export const dailyLogs = sqliteTable(
  'daily_logs',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    day: integer('day').notNull(),
    weightKg: real('weight_kg'),
    proteinG: integer('protein_g'),
    carbG: integer('carb_g'),
    fatG: integer('fat_g'),
    waistCm: real('waist_cm'),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.day] }),
    dayCheck: check('day_check', sql`${table.day} >= 1 AND ${table.day} <= 90`),
    weightCheck: check(
      'weight_check',
      sql`${table.weightKg} IS NULL OR (${table.weightKg} >= 30 AND ${table.weightKg} <= 300)`
    ),
    proteinCheck: check(
      'protein_check',
      sql`${table.proteinG} IS NULL OR (${table.proteinG} >= 0 AND ${table.proteinG} <= 2000)`
    ),
    carbCheck: check(
      'carb_check',
      sql`${table.carbG} IS NULL OR (${table.carbG} >= 0 AND ${table.carbG} <= 2000)`
    ),
    fatCheck: check(
      'fat_check',
      sql`${table.fatG} IS NULL OR (${table.fatG} >= 0 AND ${table.fatG} <= 2000)`
    ),
    waistCheck: check(
      'waist_check',
      sql`${table.waistCm} IS NULL OR (${table.waistCm} >= 30 AND ${table.waistCm} <= 250)`
    ),
  })
);

export const loginAttempts = sqliteTable('login_attempts', {
  key: text('key').notNull(),
  at: integer('at').notNull(),
});
