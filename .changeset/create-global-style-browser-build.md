---
"jest-styled-components": patch
---

Load styled-components' browser build from the test setup so `toHaveStyleRule` can see `createGlobalStyle` rules under jsdom on v5 and on v6.4 and later
