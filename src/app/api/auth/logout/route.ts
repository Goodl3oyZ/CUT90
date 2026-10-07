import { NextRequest, NextResponse } from 'next/server';
import {
  clearSessionCookie,
  invalidateSession,
  SESSION_COOKIE_NAME,
  validateCsrfOrigin,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!validateCsrfOrigin(req)) {
    return NextResponse.json(
      { error: { code: 'CSRF_REJECTED', message: 'คำขอไม่ถูกส่งมาจากแหล่งที่มาที่ถูกต้อง' } },
      { status: 403 }
    );
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await invalidateSession(token);
  }

  const res = NextResponse.json({ success: true });
  clearSessionCookie(res);
  return res;
}
