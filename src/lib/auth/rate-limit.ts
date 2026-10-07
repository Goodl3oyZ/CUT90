import { db } from '../db';
import { loginAttempts } from '../db/schema';
import { and, gte, lt, eq, count } from 'drizzle-orm';

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export async function isLoginRateLimited(
  username: string,
  ip: string
): Promise<boolean> {
  const key = `login:${username.toLowerCase()}:${ip}`;
  const cutoff = Date.now() - LOGIN_WINDOW_MS;

  const result = await db
    .select({ total: count() })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.key, key), gte(loginAttempts.at, cutoff)))
    .get();

  return (result?.total ?? 0) >= MAX_LOGIN_ATTEMPTS;
}

export async function recordFailedLoginAttempt(
  username: string,
  ip: string
): Promise<void> {
  const key = `login:${username.toLowerCase()}:${ip}`;
  const now = Date.now();

  await db.insert(loginAttempts).values({ key, at: now });

  // Cleanup old attempts older than 1 hour
  const oldCutoff = now - 60 * 60 * 1000;
  await db.delete(loginAttempts).where(lt(loginAttempts.at, oldCutoff));
}

export async function clearFailedLoginAttempts(
  username: string,
  ip: string
): Promise<void> {
  const key = `login:${username.toLowerCase()}:${ip}`;
  await db.delete(loginAttempts).where(eq(loginAttempts.key, key));
}

export async function isIpRateLimited(
  prefix: string,
  ip: string,
  maxRequests: number = 30,
  windowMs: number = 15 * 60 * 1000
): Promise<boolean> {
  const key = `${prefix}:${ip}`;
  const cutoff = Date.now() - windowMs;

  const result = await db
    .select({ total: count() })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.key, key), gte(loginAttempts.at, cutoff)))
    .get();

  if ((result?.total ?? 0) >= maxRequests) {
    return true;
  }

  await db.insert(loginAttempts).values({ key, at: Date.now() });
  return false;
}
