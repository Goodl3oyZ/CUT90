import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { loginSchema } from '@/lib/validation/schemas';
import {
  clearFailedLoginAttempts,
  createSession,
  getClientIp,
  isLoginRateLimited,
  recordFailedLoginAttempt,
  setSessionCookie,
  validateCsrfOrigin,
  verifyPassword,
} from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  if (!validateCsrfOrigin(req)) {
    return NextResponse.json(
      { error: { code: 'CSRF_REJECTED', message: 'คำขอไม่ถูกส่งมาจากแหล่งที่มาที่ถูกต้อง' } },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' } },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const ip = getClientIp(req);

    if (await isLoginRateLimited(username, ip)) {
      return NextResponse.json(
        {
          error: {
            code: 'TOO_MANY_ATTEMPTS',
            message: 'พยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในอีก 15 นาที',
          },
        },
        { status: 429 }
      );
    }

    const userRecord = await db
      .select({
        id: users.id,
        username: users.username,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .get();

    // Constant-time check even if user doesn't exist
    const dummyHash =
      '$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const hashToVerify = userRecord ? userRecord.passwordHash : dummyHash;
    const isValid = await verifyPassword(hashToVerify, password);

    if (!userRecord || !isValid) {
      await recordFailedLoginAttempt(username, ip);
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          },
        },
        { status: 401 }
      );
    }

    await clearFailedLoginAttempts(username, ip);

    const token = await createSession(userRecord.id);
    const res = NextResponse.json({
      user: { id: userRecord.id, username: userRecord.username },
    });

    setSessionCookie(res, token);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดภายในระบบ' } },
      { status: 500 }
    );
  }
}
