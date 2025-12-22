import * as compose from 'docker-compose';
import { afterAll } from 'vitest';

/**
 * Test teardown file executed after all E2E test suites.
 */
afterAll(async () => {
  console.log('Removing testing Docker containers...');

  // Remove the testing Docker containers.
  await compose.downAll({ config: 'docker-compose.test.yml' });

  console.log('Testing Docker containers are down!');
});
