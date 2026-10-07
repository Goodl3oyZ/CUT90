import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';

async function main() {
  const allUsers = await db.select().from(users).all();

  console.log('\n--- Cut 90 Registered Users ---');
  if (allUsers.length === 0) {
    console.log('No users found in database.');
  } else {
    console.table(
      allUsers.map((u) => ({
        ID: u.id,
        Username: u.username,
        CreatedAt: new Date(u.createdAt).toISOString(),
      }))
    );
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
