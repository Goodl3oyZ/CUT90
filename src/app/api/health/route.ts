import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export async function GET() {
  try {
    await db.select({ total: count() }).from(users).get();
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'ok',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'down',
      },
      { status: 500 }
    );
  }
}
