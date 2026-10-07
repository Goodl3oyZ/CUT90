import crypto from 'crypto';
import { db } from '../db';
import { sessions, users } from '../db/schema';
import { eq, and, gte, ne } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || 'cut90_session';
export const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: number): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const now = Date.now();
  const expiresAt = now + SESSION_EXPIRY_MS;

  await db.insert(sessions).values({
    id: tokenHash,
    userId,
    createdAt: now,
    expiresAt,
  });

  return token;
}

export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRY_MS / 1000,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.delete({
    name: SESSION_COOKIE_NAME,
    path: '/',
  });
}

export interface AuthSession {
  user: {
    id: number;
    username: string;
  };
  sessionId: string;
}

export async function getAuthSession(
  req?: NextRequest
): Promise<AuthSession | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      token = undefined;
    }
  }

  if (!token) return null;

  const tokenHash = hashToken(token);
  const now = Date.now();

  const sessionRecord = await db
    .select({
      sessionId: sessions.id,
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      username: users.username,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, tokenHash), gte(sessions.expiresAt, now)))
    .get();

  if (!sessionRecord) return null;

  // Sliding 30-day expiry update if remaining time is less than 15 days
  if (sessionRecord.expiresAt - now < 15 * 24 * 60 * 60 * 1000) {
    await db
      .update(sessions)
      .set({ expiresAt: now + SESSION_EXPIRY_MS })
      .where(eq(sessions.id, tokenHash));
  }

  return {
    user: {
      id: sessionRecord.userId,
      username: sessionRecord.username,
    },
    sessionId: sessionRecord.sessionId,
  };
}

export async function invalidateSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await db.delete(sessions).where(eq(sessions.id, tokenHash));
}

export async function invalidateOtherSessions(
  userId: number,
  currentToken: string
): Promise<void> {
  const currentTokenHash = hashToken(currentToken);
  await db
    .delete(sessions)
    .where(and(eq(sessions.userId, userId), ne(sessions.id, currentTokenHash)));
}
