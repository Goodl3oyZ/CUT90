import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyLogs, profiles } from '@/lib/db/schema';
import { getAuthSession } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const session = await getAuthSession(req);
  if (!session) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' } },
      { status: 401 }
    );
  }

  try {
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .get();

    const logs = await db
      .select()
      .from(dailyLogs)
      .where(eq(dailyLogs.userId, session.user.id))
      .orderBy(asc(dailyLogs.day))
      .all();

    return NextResponse.json({
      profile: profile ?? null,
      logs,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดในการส่งออกข้อมูล' } },
      { status: 500 }
    );
  }
}
