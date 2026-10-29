import { createRequire } from 'node:module';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^styled-components$/,
        replacement: require.resolve(
          'styled-components/dist/styled-components.browser.cjs.js'
        ),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: false,
  },
});
