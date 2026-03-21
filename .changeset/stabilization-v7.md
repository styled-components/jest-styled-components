---
"jest-styled-components": minor
---

### Security
- Bump `@adobe/css-tools` to ^4.4.0, fixing CVE-2023-48631 (ReDoS) and adding `@starting-style` support

### Bug Fixes
- Fix null/undefined children crash in snapshot serializer
- Fix `@media` query whitespace mismatch in `toHaveStyleRule`
- Normalize spaces after commas in CSS value comparison (fixes `rgb()` and `font-family` mismatches)
- Add word boundaries to class name replacement regex to prevent partial matches
- Fix Enzyme shallow rendering assertion for nested styled children on SC v6
- Guard `expect` and `beforeEach` calls for Vitest/Bun non-globals mode compatibility

### Features
- Add `selector` option to `toHaveStyleRule` for testing `createGlobalStyle` styles
- Add Vitest entry point (`jest-styled-components/vitest`) with types
- Add TypeScript declarations for `jest-styled-components/serializer` and `jest-styled-components/native` subpaths
- Export `resetStyleSheet` for manual test setup in non-Jest environments
- Add JSDoc comments to all type declarations

### Infrastructure
- Adopt changesets for versioning and releases
- Add provenance-based release workflow via GitHub Actions
- Update GitHub Actions to v4 (checkout, setup-node, cache) and CodeQL to v3
- Add `publint` to test pipeline for package validation
- Add `"type": "commonjs"` to package.json
