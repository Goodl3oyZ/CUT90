import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyLogs, profiles } from '@/lib/db/schema';
import { getAuthSession, validateCsrfOrigin } from '@/lib/auth';
import { importSchema } from '@/lib/validation/schemas';
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
    const parsed = importSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: `ไฟล์นำเข้าไม่ถูกต้อง: ${issue.message}` } },
        { status: 400 }
      );
    }

    const { profile: pData, logs: lData } = parsed.data;
    const now = Date.now();
    const userId = session.user.id;

    // Delete existing profile & daily logs for user
    await db.delete(profiles).where(eq(profiles.userId, userId));
    await db.delete(dailyLogs).where(eq(dailyLogs.userId, userId));

    // Insert new profile
    await db.insert(profiles).values({
      userId,
      sex: pData.sex,
      age: pData.age,
      heightCm: pData.heightCm,
      startWeight: pData.startWeight,
      goalWeight: pData.goalWeight,
      activity: pData.activity,
      startDate: pData.startDate,
      proteinGPerKg: pData.proteinGPerKg,
      fatGPerKg: pData.fatGPerKg,
      recalDay: pData.recalDay ?? null,
      recalWeight: pData.recalWeight ?? null,
      updatedAt: now,
    });

    // Insert logs
    if (lData && lData.length > 0) {
      const logRows = lData.map((l) => ({
        userId,
        day: l.day,
        weightKg: l.weightKg ?? null,
        proteinG: l.proteinG ?? null,
        carbG: l.carbG ?? null,
        fatG: l.fatG ?? null,
        waistCm: l.waistCm ?? null,
        updatedAt: l.updatedAt ?? now,
      }));

      await db.insert(dailyLogs).values(logRows);
    }

    return NextResponse.json({ success: true, message: 'นำเข้าข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล' } },
      { status: 500 }
    );
  }
}
