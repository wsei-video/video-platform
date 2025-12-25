import { resolve } from 'node:path';

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: resolve(__dirname),
  plugins: [swc.vite()],
  resolve: {
    alias: {
      '@video/lib': resolve(__dirname, '../../libs/video-lib/src'),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globals: true,
    fileParallelism: false,
    testTimeout: 20000,
    setupFiles: ['test/testing/setup.ts', 'test/testing/teardown.ts'],
  },
});
