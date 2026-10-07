import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { registerSchema } from '@/lib/validation/schemas';
import {
  createSession,
  getClientIp,
  hashPassword,
  isIpRateLimited,
  setSessionCookie,
  validateCsrfOrigin,
} from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  if (!validateCsrfOrigin(req)) {
    return NextResponse.json(
      { error: { code: 'CSRF_REJECTED', message: 'คำขอไม่ถูกส่งมาจากแหล่งที่มาที่ถูกต้อง' } },
      { status: 403 }
    );
  }

  const allowSignup = process.env.ALLOW_SIGNUP !== 'false';
  if (!allowSignup) {
    return NextResponse.json(
      { error: { code: 'SIGNUP_DISABLED', message: 'ระบบปิดการลงทะเบียนอยู่ในขณะนี้' } },
      { status: 403 }
    );
  }

  const ip = getClientIp(req);
  if (await isIpRateLimited('register', ip, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'พยายามสมัครสมาชิกมากเกินไป กรุณาลองใหม่ภายหลัง' } },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: issue.message } },
        { status: 400 }
      );
    }

    const { username, password, inviteCode } = parsed.data;

    const requiredInviteCode = process.env.INVITE_CODE;
    if (requiredInviteCode && inviteCode !== requiredInviteCode) {
      return NextResponse.json(
        { error: { code: 'INVALID_INVITE_CODE', message: 'รหัสเชิญไม่ถูกต้อง' } },
        { status: 400 }
      );
    }

    // Check if username exists (case insensitive)
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .get();

    if (existing) {
      return NextResponse.json(
        { error: { code: 'USERNAME_TAKEN', message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' } },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const now = Date.now();

    const [newUser] = await db
      .insert(users)
      .values({
        username: username.toLowerCase(),
        passwordHash,
        createdAt: now,
      })
      .returning({ id: users.id, username: users.username });

    const token = await createSession(newUser.id);
    const res = NextResponse.json({
      user: { id: newUser.id, username: newUser.username },
    });

    setSessionCookie(res, token);
    return res;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดภายในระบบ' } },
      { status: 500 }
    );
  }
}
