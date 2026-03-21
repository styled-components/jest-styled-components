---
"jest-styled-components": patch
---

### Security
- Bump `@adobe/css-tools` to ^4.4.0, fixing CVE-2023-48631 (ReDoS) and adding `@starting-style` support

### Bug Fixes
- Fix null/undefined children crash in snapshot serializer
- Fix `@media` query whitespace mismatch in `toHaveStyleRule`
- Normalize spaces after commas in CSS value comparison (fixes `rgb()` and `font-family` mismatches)
- Guard `beforeEach` call for Vitest non-globals mode compatibility
- Fix Enzyme shallow rendering assertion for nested styled children on SC v6

### Features
- Add `selector` option to `toHaveStyleRule` for testing `createGlobalStyle` styles
- Add TypeScript declarations for `jest-styled-components/serializer` subpath
- Add JSDoc comments to all `Options` and `Matchers` type declarations
