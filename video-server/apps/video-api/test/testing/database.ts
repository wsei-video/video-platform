import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@video/lib/database/client';

beforeEach(async () => {
  // Truncate all database tables after running each E2E test.
  const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_URL_LOCAL });
  const prisma = new PrismaClient({ adapter });

  const tables = await prisma.$queryRawUnsafe<{ tablename: string }[]>(`
    SELECT tablename FROM pg_tables WHERE schemaname='public';
  `);

  for (const { tablename } of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`);
  }

  await prisma.$disconnect();
});
