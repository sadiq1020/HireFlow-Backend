import 'dotenv/config';
import { auth } from '../src/lib/auth';
import prisma from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME must be set in .env');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    });

    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  const categories = [
    { name: 'Engineering', icon: '⚙️' },
    { name: 'Design', icon: '🎨' },
    { name: 'Marketing', icon: '📣' },
    { name: 'Finance', icon: '💰' },
    { name: 'Healthcare', icon: '🏥' },
    { name: 'Education', icon: '📚' },
    { name: 'Sales', icon: '🤝' },
    { name: 'Customer Support', icon: '💬' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log(`✅ ${categories.length} categories seeded`);
  console.log('🎉 Seeding complete');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});