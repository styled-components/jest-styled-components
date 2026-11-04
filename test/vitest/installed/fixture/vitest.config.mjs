import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);

export default defineConfig({
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
    include: ['*.fixture.mjs'],
    server: {
      deps: {
        inline: ['jest-styled-components'],
      },
    },
    setupFiles: ['./setup.mjs'],
  },
});
