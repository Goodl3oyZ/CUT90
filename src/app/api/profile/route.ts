import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { getAuthSession, validateCsrfOrigin } from '@/lib/auth';
import { profileSchema } from '@/lib/validation/schemas';
import { eq } from 'drizzle-orm';

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

    return NextResponse.json({ profile: profile ?? null });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์' } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: `${issue.path.join('.')}: ${issue.message}` } },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const now = Date.now();

    const profileData = {
      userId: session.user.id,
      sex: data.sex,
      age: data.age,
      heightCm: data.heightCm,
      startWeight: data.startWeight,
      goalWeight: data.goalWeight,
      activity: data.activity,
      startDate: data.startDate,
      proteinGPerKg: data.proteinGPerKg,
      fatGPerKg: data.fatGPerKg,
      recalDay: data.recalDay ?? null,
      recalWeight: data.recalWeight ?? null,
      updatedAt: now,
    };

    const existing = await db
      .select({ userId: profiles.userId })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .get();

    if (existing) {
      await db
        .update(profiles)
        .set(profileData)
        .where(eq(profiles.userId, session.user.id));
    } else {
      await db.insert(profiles).values(profileData);
    }

    const updatedProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .get();

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดในการบันทึกโปรไฟล์' } },
      { status: 500 }
    );
  }
}
