import { execSync } from 'child_process';

beforeEach(() => {
  // Reset the testing database before running each E2E test.
  execSync('npx prisma migrate reset -f');
});
