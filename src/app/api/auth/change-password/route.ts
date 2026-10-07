import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { changePasswordSchema } from '@/lib/validation/schemas';
import {
  getAuthSession,
  hashPassword,
  invalidateOtherSessions,
  SESSION_COOKIE_NAME,
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

  const session = await getAuthSession(req);
  if (!session) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: issue.message } },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const userRecord = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, session.user.id))
      .get();

    if (!userRecord || !(await verifyPassword(userRecord.passwordHash, currentPassword))) {
      return NextResponse.json(
        { error: { code: 'INVALID_CURRENT_PASSWORD', message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' } },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, session.user.id));

    // Invalidate all other sessions except current
    const currentToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (currentToken) {
      await invalidateOtherSessions(session.user.id, currentToken);
    }

    return NextResponse.json({ success: true, message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดภายในระบบ' } },
      { status: 500 }
    );
  }
}
