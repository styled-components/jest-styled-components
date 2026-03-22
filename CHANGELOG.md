# Changelog

## 7.3.1

### Patch Changes

- c7b0e4e: **Bug Fixes**

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

## 7.3.0

### Minor Changes

- 07709eb: **Security**

  - Bump `@adobe/css-tools` to ^4.4.0, fixing CVE-2023-48631 (ReDoS) and adding `@starting-style` support

  **Bug Fixes**

  - Fix null/undefined children crash in snapshot serializer
  - Fix `@media` query whitespace mismatch in `toHaveStyleRule`
  - Normalize spaces after commas in CSS value comparison (fixes `rgb()` and `font-family` mismatches)
  - Add word boundaries to class name replacement regex to prevent partial matches
  - Fix Enzyme shallow rendering assertion for nested styled children on SC v6
  - Guard `expect` and `beforeEach` calls for Vitest/Bun non-globals mode compatibility

  **Features**

  - Add `selector` option to `toHaveStyleRule` for testing `createGlobalStyle` styles
  - Add Vitest entry point (`jest-styled-components/vitest`) with types
  - Add TypeScript declarations for `jest-styled-components/serializer` and `jest-styled-components/native` subpaths
  - Export `resetStyleSheet` for manual test setup in non-Jest environments
  - Add JSDoc comments to all type declarations

  **Infrastructure**

  - Adopt changesets for versioning and releases
  - Add provenance-based release workflow via GitHub Actions
  - Update GitHub Actions to v4 (checkout, setup-node, cache) and CodeQL to v3
  - Add `publint` to test pipeline for package validation
  - Add `"type": "commonjs"` to package.json

See [GitHub releases](https://github.com/styled-components/jest-styled-components/releases).
