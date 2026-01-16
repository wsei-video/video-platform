import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@video/lib/database/client';
import { MeiliSearch } from 'meilisearch';

beforeEach(async () => {
  await Promise.all([clearMeiliSearch(), clearPostgres()]);
}, 10000);

const clearMeiliSearch = async () => {
  // Delete all documents from all indexes
  const meili = new MeiliSearch({ host: process.env.MEILISEARCH_URL_LOCAL!, apiKey: process.env.MEILISEARCH_KEY });
  const indexes = await meili.getIndexes();
  const tasks = await Promise.all(indexes.results.map(index => index.deleteAllDocuments()));
  await meili.tasks.waitForTasks(tasks);
};

const clearPostgres = async () => {
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
};
