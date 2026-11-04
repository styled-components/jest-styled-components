---
"jest-styled-components": patch
---

Document an opt-in browser build setup for asserting `createGlobalStyle` rules on styled-components v5, 6.0 through 6.2, and 6.4.0 and later, and point the Vitest matcher at the module the Vitest entry imports. A failed `toHaveStyleRule` assertion that uses `selector` now links to that setup
