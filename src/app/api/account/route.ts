import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { clearSessionCookie, getAuthSession, validateCsrfOrigin } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function DELETE(req: NextRequest) {
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
    await db.delete(users).where(eq(users.id, session.user.id));
    const res = NextResponse.json({ success: true, message: 'ลบบัญชีเรียบร้อยแล้ว' });
    clearSessionCookie(res);
    return res;
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดในการลบบัญชี' } },
      { status: 500 }
    );
  }
}
