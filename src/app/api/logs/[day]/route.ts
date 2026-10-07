import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyLogs } from '@/lib/db/schema';
import { getAuthSession, validateCsrfOrigin } from '@/lib/auth';
import { dailyLogSchema } from '@/lib/validation/schemas';
import { and, eq } from 'drizzle-orm';

export async function PUT(
  req: NextRequest,
  { params }: { params: { day: string } }
) {
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

  const dayNum = parseInt(params.day, 10);
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 90) {
    return NextResponse.json(
      { error: { code: 'INVALID_DAY', message: 'วันต้องอยู่ระหว่าง 1 ถึง 90' } },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const parsed = dailyLogSchema.safeParse({ ...body, day: dayNum });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: issue.message } },
        { status: 400 }
      );
    }

    const { weightKg, proteinG, carbG, fatG, waistCm, updatedAt } = parsed.data;
    const clientUpdatedAt = updatedAt ?? Date.now();

    const existing = await db
      .select({ updatedAt: dailyLogs.updatedAt })
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, session.user.id), eq(dailyLogs.day, dayNum)))
      .get();

    // Last-write-wins by updatedAt timestamp
    if (existing && existing.updatedAt > clientUpdatedAt) {
      const currentLog = await db
        .select()
        .from(dailyLogs)
        .where(and(eq(dailyLogs.userId, session.user.id), eq(dailyLogs.day, dayNum)))
        .get();
      return NextResponse.json({ log: currentLog, skipped: true });
    }

    const logRecord = {
      userId: session.user.id,
      day: dayNum,
      weightKg: weightKg ?? null,
      proteinG: proteinG ?? null,
      carbG: carbG ?? null,
      fatG: fatG ?? null,
      waistCm: waistCm ?? null,
      updatedAt: clientUpdatedAt,
    };

    if (existing) {
      await db
        .update(dailyLogs)
        .set(logRecord)
        .where(and(eq(dailyLogs.userId, session.user.id), eq(dailyLogs.day, dayNum)));
    } else {
      await db.insert(dailyLogs).values(logRecord);
    }

    const updatedLog = await db
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, session.user.id), eq(dailyLogs.day, dayNum)))
      .get();

    return NextResponse.json({ log: updatedLog });
  } catch (error) {
    console.error('Update log error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลประจำวัน' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { day: string } }
) {
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

  const dayNum = parseInt(params.day, 10);
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 90) {
    return NextResponse.json(
      { error: { code: 'INVALID_DAY', message: 'วันต้องอยู่ระหว่าง 1 ถึง 90' } },
      { status: 400 }
    );
  }

  try {
    await db
      .delete(dailyLogs)
      .where(and(eq(dailyLogs.userId, session.user.id), eq(dailyLogs.day, dayNum)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete log error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดในการลบข้อมูล' } },
      { status: 500 }
    );
  }
}
