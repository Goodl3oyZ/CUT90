import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';
import { hashPassword } from '../src/lib/auth/password';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  const args = process.argv.slice(2);
  const username = args.find((arg) => !arg.startsWith('-')) || args[0];

  if (!username) {
    console.error('Usage: npm run user:reset-password -- <username>');
    process.exit(1);
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .get();

  if (!user) {
    console.error(`User "${username}" not found.`);
    process.exit(1);
  }

  const newPassword = crypto.randomBytes(6).toString('hex'); // 12 chars hex
  const passwordHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, user.id));

  console.log(`Password reset successful for user "${user.username}".`);
  console.log(`New Password: ${newPassword}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
