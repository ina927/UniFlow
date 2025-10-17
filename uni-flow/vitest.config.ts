/// <reference types="vitest" />
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/utils/vitest.setup.ts'],
    include: ['__tests__/**/*.test.ts', 'src/**/*.test.ts'],
  },
});
