import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['matcher.fixture.mjs'],
    setupFiles: ['./setup.mjs'],
  },
});
