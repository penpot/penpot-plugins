/// <reference types='vitest' />
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/lorem-ipsum-plugin',
  test: {
    watch: false,
    globals: true,
    cache: {
      dir: '../node_modules/.vitest',
    },
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../coverage/e2e',
      provider: 'v8',
    },
  },
});
