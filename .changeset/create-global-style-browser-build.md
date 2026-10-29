---
"jest-styled-components": patch
---

Document the Jest `moduleNameMapper` and Vitest alias that load styled-components' browser build, and point the Vitest matcher at that same module, so `toHaveStyleRule` can see `createGlobalStyle` rules on v5 and on v6.4 and later
