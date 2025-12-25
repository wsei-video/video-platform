import { beforeAll } from 'vitest';
import compose from 'docker-compose';
import dotenv from 'dotenv';
import expand from 'dotenv-expand';

// Override environment variables with testing variables.
expand.expand(dotenv.config({ path: '.env.test', override: true }));

/**
 * Test setup file executed before all E2E test suites.
 */
beforeAll(async () => {
  console.log('Spawning testing Docker containers...');

  // Create the testing Docker containers.
  await compose.upAll({ config: 'docker-compose.test.yml' });

  console.log('Testing Docker containers are up!');
});
