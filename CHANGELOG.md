# Changelog

## 7.4.1

### Patch Changes

- afca71e: Fix a crash on load under Bun. Stable Bun releases through 1.4.4 expose `expect.addSnapshotSerializer` but throw "Not implemented" when it is called, so importing this package stopped every test. `toHaveStyleRule` now works on those releases, and snapshots keep hashed class names until Bun ships the API
- 42af42f: Document an opt-in browser build setup for asserting `createGlobalStyle` rules on styled-components v5, 6.0 through 6.2, and 6.4.0 and later, and point the Vitest matcher at the module the Vitest entry imports. A failed `toHaveStyleRule` assertion that uses `selector` now links to that setup

## 7.4.0

### Minor Changes

- 972060f: Stabilize keyframe names in snapshots by replacing hashed `@keyframes` identifiers with deterministic placeholders (`k0`, `k1`, etc.), matching the existing `c0`/`c1` behavior for class names
- 74fee2e: Add `namespace` option to `toHaveStyleRule` for matching rules generated with `StyleSheetManager namespace`. Can be set per-assertion or globally via `setStyleRuleOptions({ namespace: '#app' })`.

### Patch Changes

- a9cb0aa: Fix Vitest compatibility: convert vitest entrypoint to ESM and remove test framework dependency from matcherTest

## 7.3.1

### Patch Changes

- Fix native `toHaveStyleRule` crash when element has no `style` prop (#225, #110)
- Fix nested at-rules (`@media` inside `@supports` and vice versa) not found by `toHaveStyleRule` (#245)
- Fix `getHTML()` creating an empty `ServerStyleSheet` instead of reading from the global sheet (#401)
- Fix selector matching with spaces around CSS combinators (`> ul > li > a`)
- Fix invalid CSS causing cryptic parse errors — shows the offending rule with context and caret (#147)
- Fix nested React Native style arrays not flattening correctly
- Add `@container` and `@layer` at-rule support for `toHaveStyleRule` and the snapshot serializer
- Add opt-in CSS parse caching via `import 'jest-styled-components/cache'` (#235)
- Normalize whitespace in value comparisons (`!important`, shorthand separators, commas)
- Clearer validation messages: "Property not found" vs "Value mismatch"
- Export `disableCSSCache` from `jest-styled-components/cache`
- Use `Set` for O(1) hash lookups; serializer no longer mutates the parsed CSS AST

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
