import { db } from '../src/lib/db';
import { runMigrations } from '../src/lib/db/migrate';
import { users, profiles, dailyLogs } from '../src/lib/db/schema';
import { hashPassword } from '../src/lib/auth/password';
import { eq } from 'drizzle-orm';

async function main() {
  await runMigrations();

  const now = Date.now();
  const username = 'demo';
  const password = 'demo1234Password!';

  let existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();

  let userId: number;

  if (!existingUser) {
    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ username, passwordHash, createdAt: now })
      .returning();
    userId = newUser.id;
    console.log(`Created demo user: "${username}" / "${password}"`);
  } else {
    userId = existingUser.id;
    console.log(`Demo user "${username}" already exists.`);
  }

  // Delete existing profile & logs for clean seed
  await db.delete(profiles).where(eq(profiles.userId, userId));
  await db.delete(dailyLogs).where(eq(dailyLogs.userId, userId));

  // Profile setup
  await db.insert(profiles).values({
    userId,
    sex: 'male',
    age: 30,
    heightCm: 175,
    startWeight: 79.3,
    goalWeight: 69.5,
    activity: 'moderately',
    startDate: '2026-10-01',
    proteinGPerKg: 2.1,
    fatGPerKg: 0.8,
    updatedAt: now,
  });

  // Seed weights for days 1..7: 79.3, 79.45, 79.2, 79.3, 78.7, 78.7, 79.1
  const seedWeights = [79.3, 79.45, 79.2, 79.3, 78.7, 78.7, 79.1];

  for (let i = 0; i < seedWeights.length; i++) {
    const day = i + 1;
    await db.insert(dailyLogs).values({
      userId,
      day,
      weightKg: seedWeights[i],
      proteinG: 167,
      carbG: 154,
      fatG: 63,
      updatedAt: now + i * 1000,
    });
  }

  console.log(`Seeded profile and ${seedWeights.length} daily logs for user "${username}".`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
