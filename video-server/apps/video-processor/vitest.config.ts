import { resolve } from 'node:path';

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [swc.vite()],
  resolve: {
    alias: {
      '@video/lib': resolve(__dirname, '../../libs/video-lib/src'),
    },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    fileParallelism: true,
    testTimeout: 20000,
    coverage: {
      enabled: true,
    },
    reporters: 'verbose',
  },
});
