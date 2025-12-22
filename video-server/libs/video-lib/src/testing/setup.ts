import dotenv from 'dotenv';
import expand from 'dotenv-expand';

// Setup test environment variables for unit tests.
expand.expand(dotenv.config({ path: '.env.test', override: true }));
