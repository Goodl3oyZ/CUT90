import { describe, expect, it, beforeAll, beforeEach } from 'vitest';
import { db } from '../../lib/db';
import { runMigrations } from '../../lib/db/migrate';
import { users, sessions, loginAttempts } from '../../lib/db/schema';
import { hashPassword, createSession, verifyPassword, isLoginRateLimited, recordFailedLoginAttempt } from '../../lib/auth';
import { eq } from 'drizzle-orm';

describe('Auth & Security API Integration Tests', () => {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await db.delete(loginAttempts);
    await db.delete(sessions);
    await db.delete(users);
  });

  it('hashes passwords using Argon2id and verifies successfully', async () => {
    const rawPass = 'SecretPassword123!';
    const hashed = await hashPassword(rawPass);

    expect(hashed).toContain('$argon2id$');
    const isValid = await verifyPassword(hashed, rawPass);
    expect(isValid).toBe(true);

    const isWrong = await verifyPassword(hashed, 'WrongPassword');
    expect(isWrong).toBe(false);
  });

  it('locks out after 5 consecutive failed login attempts', async () => {
    const username = 'testuser';
    const ip = '192.168.1.1';

    for (let i = 0; i < 4; i++) {
      await recordFailedLoginAttempt(username, ip);
      expect(await isLoginRateLimited(username, ip)).toBe(false);
    }

    // 5th failed attempt triggers lock out
    await recordFailedLoginAttempt(username, ip);
    expect(await isLoginRateLimited(username, ip)).toBe(true);
  });

  it('handles session token generation and database storage', async () => {
    const now = Date.now();
    const [user] = await db
      .insert(users)
      .values({ username: 'sessionuser', passwordHash: 'hash', createdAt: now })
      .returning();

    const token = await createSession(user.id);
    expect(token).toHaveLength(64); // 32 bytes hex = 64 chars

    const dbSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, user.id))
      .all();

    expect(dbSessions).toHaveLength(1);
    expect(dbSessions[0].id).not.toBe(token); // Only SHA-256 hash stored in DB
  });
});
