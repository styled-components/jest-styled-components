---
"jest-styled-components": patch
---

**Bug Fixes**

- Fix native `toHaveStyleRule` crash when element has no `style` prop (#225, #110)
- Fix nested at-rules (`@media` inside `@supports` and vice versa) not being found by `toHaveStyleRule` (#245)
- Fix `getHTML()` creating an empty `ServerStyleSheet` instead of reading from the global sheet (#401)
- Fix selector matching with spaces around CSS combinators (`> ul > li > a` now matches correctly)
- Fix invalid CSS causing cryptic parse errors — now shows the offending rule with surrounding context and a caret pointing at the exact error position (#147)

**Improvements**

- Add opt-in CSS parse caching via `import 'jest-styled-components/cache'` for faster `toHaveStyleRule` in large test suites (#235)
- Normalize whitespace in value comparisons so `red !important`, `sidebar / inline-size`, and `rgb(0, 0, 0)` match their stylis-formatted equivalents (skips quoted strings)
- Clearer validation messages: "Property not found" instead of cryptic crash, human-readable options formatting, better negation wording
- Add `cache/index.d.ts` for TypeScript users importing the cache entry point
- Use `Set` for hash lookups (O(1) vs O(n) per lookup)
- Serializer no longer mutates the parsed CSS AST
