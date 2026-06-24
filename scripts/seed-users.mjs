/**
 * Seeds the root admin account into MongoDB.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-users.mjs
 */
import crypto from 'crypto';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'sheniketan';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is required. Run with: node --env-file=.env.local scripts/seed-users.mjs');
  process.exit(1);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const ROOT_ADMIN = {
  name: 'Root Admin',
  email: 'root@gmail.com',
  password: 'rootpassword',
  role: 'admin',
  phone: '',
};

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const users = db.collection('users');

    await users.createIndex({ email: 1 }, { unique: true });

    const email = ROOT_ADMIN.email.toLowerCase();
    const passwordHash = hashPassword(ROOT_ADMIN.password);

    const result = await users.updateOne(
      { email },
      {
        $set: {
          name: ROOT_ADMIN.name,
          email,
          passwordHash,
          role: ROOT_ADMIN.role,
          phone: ROOT_ADMIN.phone,
          isActive: true,
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`✓ Created admin account: ${email}`);
    } else {
      console.log(`✓ Updated admin account: ${email}`);
    }

    console.log('\nAdmin login at /auth/admin');
    console.log(`  Email:      ${ROOT_ADMIN.email}`);
    console.log(`  Password:   ${ROOT_ADMIN.password}`);
    console.log(`  Access key: ${process.env.ADMIN_SECRET || '(set ADMIN_SECRET in .env.local)'}`);
    console.log('\nWardens are created by admin at /admin/wardens');
    console.log('Residents sign up at /register');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
