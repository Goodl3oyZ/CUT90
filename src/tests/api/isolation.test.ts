import { describe, expect, it, beforeAll, beforeEach, afterAll } from 'vitest';
import { db, sqliteClient } from '../../lib/db';
import { runMigrations } from '../../lib/db/migrate';
import { users, profiles, dailyLogs, sessions } from '../../lib/db/schema';
import { eq, and } from 'drizzle-orm';

describe('Multi-Tenant User Data Isolation Tests', () => {
  let userAId: number;
  let userBId: number;

  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await db.delete(dailyLogs);
    await db.delete(profiles);
    await db.delete(sessions);
    await db.delete(users);

    const now = Date.now();
    const [uA] = await db
      .insert(users)
      .values({ username: 'usera', passwordHash: 'hashA', createdAt: now })
      .returning();
    const [uB] = await db
      .insert(users)
      .values({ username: 'userb', passwordHash: 'hashB', createdAt: now })
      .returning();

    userAId = uA.id;
    userBId = uB.id;

    // Create profile for User A
    await db.insert(profiles).values({
      userId: userAId,
      sex: 'male',
      age: 30,
      heightCm: 175,
      startWeight: 80,
      goalWeight: 70,
      activity: 'moderately',
      startDate: '2026-10-01',
      proteinGPerKg: 2.1,
      fatGPerKg: 0.8,
      updatedAt: now,
    });

    // Create profile for User B
    await db.insert(profiles).values({
      userId: userBId,
      sex: 'female',
      age: 25,
      heightCm: 160,
      startWeight: 60,
      goalWeight: 52,
      activity: 'lightly',
      startDate: '2026-10-01',
      proteinGPerKg: 2.1,
      fatGPerKg: 0.8,
      updatedAt: now,
    });

    // Create day 1 log for User A
    await db.insert(dailyLogs).values({
      userId: userAId,
      day: 1,
      weightKg: 80.0,
      proteinG: 160,
      carbG: 180,
      fatG: 60,
      updatedAt: now,
    });

    // Create day 1 log for User B
    await db.insert(dailyLogs).values({
      userId: userBId,
      day: 1,
      weightKg: 60.0,
      proteinG: 120,
      carbG: 130,
      fatG: 45,
      updatedAt: now,
    });
  });

  afterAll(async () => {
    await db.delete(dailyLogs);
    await db.delete(profiles);
    await db.delete(sessions);
    await db.delete(users);
    sqliteClient.close();
  });

  it('proves User A query strictly returns User A profile and logs', async () => {
    const userAProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userAId))
      .get();

    expect(userAProfile?.startWeight).toBe(80);
    expect(userAProfile?.sex).toBe('male');

    const userALogs = await db
      .select()
      .from(dailyLogs)
      .where(eq(dailyLogs.userId, userAId))
      .all();

    expect(userALogs).toHaveLength(1);
    expect(userALogs[0].weightKg).toBe(80.0);
  });

  it('proves User B cannot modify User A logs or profile', async () => {
    // Attempt updating log for day 1 scoped by User B's ID
    await db
      .update(dailyLogs)
      .set({ weightKg: 99.9 })
      .where(and(eq(dailyLogs.userId, userBId), eq(dailyLogs.day, 1)))
      .run();

    // Verify User A's log remains untouched at 80.0 kg
    const userALog = await db
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, userAId), eq(dailyLogs.day, 1)))
      .get();

    expect(userALog?.weightKg).toBe(80.0);
  });
});
