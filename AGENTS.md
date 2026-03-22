# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

jest-styled-components is a Jest testing utility library for styled-components (v5+). It provides two main features:
1. A **snapshot serializer** that inlines CSS rules into snapshots and replaces hashed class names with deterministic placeholders (c0, c1, etc.)
2. A **`toHaveStyleRule` matcher** for asserting specific CSS property values on rendered components

## Commands

```bash
# Run all tests (web + native + preact)
yarn test

# Run only web tests
yarn test:web

# Run web tests in watch mode
yarn test:web:watch

# Run only React Native tests
yarn test:native

# Run only Preact tests
yarn test:preact

# Run a single test file
npx jest test/toHaveStyleRule.spec.js

# Update snapshots
npx jest --updateSnapshot
```

## Architecture

### Entry Points

- `src/index.js` — Main entry. Importing this registers the snapshot serializer and `toHaveStyleRule` matcher globally, and sets up `beforeEach` to reset the stylesheet between tests.
- `native/index.js` — React Native entry. Only registers the native `toHaveStyleRule` matcher (no serializer needed).
- `serializer/index.js` — Standalone serializer export for use with libraries like jest-specific-snapshot.

### Core Modules

- **`src/utils.js`** — Shared utilities. Accesses styled-components internals via `__PRIVATE__` to read/reset the global stylesheet. Parses CSS with `@adobe/css-tools`. Key exports: `resetStyleSheet`, `getCSS`, `getHashes`, `matcherTest`, `buildReturnMessage`.
- **`src/styleSheetSerializer.js`** — Jest snapshot serializer. Walks the component tree to collect class names, extracts matching CSS rules from the stylesheet, replaces hashed class names with sequential placeholders, and prepends styles to the snapshot output. Uses a `WeakSet` cache to prevent re-processing nodes during recursive serialization.
- **`src/toHaveStyleRule.js`** — Web matcher. Extracts class names from react-test-renderer JSON, Enzyme wrappers, or DOM elements, then queries parsed CSS for matching declarations. Supports `media`, `supports`, and `modifier` options for targeting nested/at-rule styles.
- **`src/native/toHaveStyleRule.js`** — React Native matcher. Works directly with the `style` prop (no CSS parsing needed), merging style arrays and converting kebab-case properties to camelCase.

### Test Configurations

Three separate Jest configs target different renderers:
- Default (`package.json` "jest" field) — Web tests using jsdom, Enzyme, and react-test-renderer. Ignores `test/native/` and `test/preact/`.
- `.jest.native.json` — React Native tests using react-native preset, node environment.
- `.jest.preact.json` — Preact tests with `moduleNameMapper` aliasing `react` → `preact/compat`.

### Renderer Detection (Duck Typing)

The matcher and serializer detect the rendering context without explicit imports:
- **react-test-renderer**: `$$typeof === Symbol.for('react.test.json')`
- **Enzyme**: Checks for `prop()` method, `dive()`, `exists()`, `findWhere()`
- **DOM elements** (`@testing-library/react`): `instanceof global.Element`, uses `classList`
- **React Native**: Accesses `props.style` directly (array or object)

### No Build Step

Source JS is published directly — no transpilation, bundling, or minification. Babel is dev-only for tests. The `"files"` field limits what's published: `native/`, `serializer/`, `src/`, `typings/`.

## Key Implementation Details

### styled-components Dependency

This library depends on styled-components' `__PRIVATE__` export (specifically `mainSheet` for v6+ or `masterSheet` for v5) to access the internal stylesheet. Changes to styled-components internals will break this. The sheet provides:
- `gs` — generation/selector tracking
- `names` — `Map<mainHash, Set<childHashes>>` of all generated class names
- `clearTag()` — resets the CSSOM tag
- `toString()` — returns all injected CSS

### Stylesheet Reset Between Tests

`resetStyleSheet()` runs in `beforeEach` (registered globally in `src/index.js`):
1. Removes all `<style[data-styled-version]>` tags from DOM
2. Clears `sheet.gs` and `sheet.names`
3. Calls `sheet.clearTag()`

### Class Name Detection

Two regex patterns are used:
- Serializer: `/^\.?(\w+(-|_))?sc-/` — matches with optional leading dot and prefix
- Matcher: `/(_|-)+sc-.+|^sc-/` — matches styled-components generated class names

### Selector Normalization

- Removes spaces after CSS combinators (`> `, `~ `, `+ `) for comparison since stylis v4 sometimes omits trailing spaces
- Normalizes single quotes to double quotes
- Complex `&` replacement logic handles `&&`, `&:hover`, `.parent &`, `& &`, etc.

### CSS Parsing

Uses `@adobe/css-tools` as the sole production dependency to parse stylesheet output into an AST, then queries rules by matching selectors against component class names. At-rules (`@media`, `@supports`) are handled by first filtering to matching at-rule blocks, then searching nested rules.

## Tooling

- **Biome** for linting and formatting (replaced ESLint + Prettier). Config in `biome.json`.
- **lint-staged** runs `biome check --write` on pre-commit via husky v4.
- **publint** validates package.json and published files (`--pack npm` due to yarn pack incompatibility).
- **@arethetypeswrong/cli** (attw) validates TypeScript type resolution across node10/node16/bundler modes.
- **knip** detects unused deps, exports, and dead files. Config in `knip.json`.
- All quality checks run as part of `yarn test` via `lint:pkg` script.
- **Changesets** for versioning with `@changesets/changelog-github` for PR-linked changelogs.

## CI

- **CI workflow** (`.github/workflows/ci.yml`): `pull_request_target` trigger (uses base branch workflow). `permissions: contents: read`.
- **Release workflow** (`.github/workflows/release.yml`): Changesets action with provenance-based npm publishing.
- **CodeQL** (`.github/workflows/codeql-analysis.yml`): Weekly JavaScript analysis.

## Open Source Maintainer Rules

### Issues

- **Never mass-close or mass-comment.** Every response posted to an issue must be individually researched and evidence-backed with a fresh code experiment.
- **Verify before closing.** Reproduce the reported scenario on the current version and confirm it's resolved before closing. Don't assume a fix covers an issue without testing.
- **Be kind and appreciative.** Thank reporters for filing. Be respectful even when closing as stale or wontfix.
- **Preserve original authorship.** When absorbing work from external PRs, credit the original author in the commit or PR description.

### PRs

- **No test plans in PR descriptions** unless explicitly requested.
- **Credit contributors.** When closing a PR whose fix was absorbed into other work, comment thanking the author and linking to the release that includes their contribution.

### Code

- **Use TDD (red/green)** when fixing bugs — write the failing test first, then fix the code.
- **Always run tests** before considering work done.
- **Research before implementing.** Go beyond official docs — review dev blogs, expert content, and source code for the deepest understanding.
