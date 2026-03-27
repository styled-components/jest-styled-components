[![NPM version](https://img.shields.io/npm/v/jest-styled-components.svg)](https://www.npmjs.com/package/jest-styled-components)
[![CI](https://github.com/styled-components/jest-styled-components/actions/workflows/ci.yml/badge.svg)](https://github.com/styled-components/jest-styled-components/actions/workflows/ci.yml)

# jest-styled-components

Testing utilities for [styled-components](https://github.com/styled-components/styled-components) (v5+). Works with Jest, Vitest, and Bun.

styled-components is largely maintained by one person. Please help fund the project for consistent long-term support and updates: [Open Collective](https://opencollective.com/styled-components)

---

**The problem:** styled-components snapshots contain opaque hashed class names and no CSS rules. When styles change, diffs show meaningless class name changes.

**The solution:** This library inlines actual CSS rules into snapshots with deterministic class placeholders (`c0`, `c1`, `k0`, `k1`) and provides a `toHaveStyleRule` matcher for asserting specific style values.

```diff
- Snapshot
+ Received

 .c0 {
-  color: green;
+  color: blue;
 }

 <button
   class="c0"
 />
```

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Quick Example](#quick-example)
- [Snapshot Testing](#snapshot-testing)
- [toHaveStyleRule](#tohavestylerule)
- [React Native](#react-native)
- [Advanced Usage](#advanced-usage)
- [Version Compatibility](#version-compatibility)
- [Troubleshooting](#troubleshooting)
- [Legacy: Enzyme](#legacy-enzyme)

## Installation

```sh
npm install --save-dev jest-styled-components
```
```sh
pnpm add -D jest-styled-components
```
```sh
yarn add -D jest-styled-components
```
```sh
bun add -D jest-styled-components
```

## Setup

Import once in a setup file to register the snapshot serializer and `toHaveStyleRule` matcher globally.

### Jest

```js
// setupTests.js
import 'jest-styled-components'
```

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
}
```

Note: Jest 27+ defaults to the `node` environment. styled-components requires a DOM, so `testEnvironment: 'jsdom'` is required. You may also need to install `jest-environment-jsdom` separately for Jest 28+.

### Vitest

```js
// setupTests.ts
import 'jest-styled-components/vitest'
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./setupTests.ts'],
  },
})
```

The Vitest entry point imports `expect` and `beforeEach` from Vitest explicitly. TypeScript types are included.

### Bun

```js
// setupTests.ts
import 'jest-styled-components'
```

Bun provides the `expect` and `beforeEach` globals that the library hooks into. Configure `preload` in your `bunfig.toml`:

```toml
[test]
preload = ["./setupTests.ts"]
```

## Quick Example

```js
import React from 'react'
import styled from 'styled-components'
import { render } from '@testing-library/react'
import 'jest-styled-components'

const Button = styled.button`
  color: red;
`

test('it works', () => {
  const { container } = render(<Button />)
  expect(container.firstChild).toMatchSnapshot()
  expect(container.firstChild).toHaveStyleRule('color', 'red')
})
```

## Snapshot Testing

The serializer replaces hashed class names with sequential placeholders (`c0`, `c1` for classes, `k0`, `k1` for keyframes) and prepends the matching CSS rules to the snapshot output. This works with `@testing-library/react`, `react-test-renderer`, and Enzyme.

### Theming

Wrap with `ThemeProvider` as you would in your app:

```js
import { ThemeProvider } from 'styled-components'

const theme = { main: 'mediumseagreen' }

test('themed component', () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Button />
    </ThemeProvider>
  )
  expect(container.firstChild).toHaveStyleRule('color', 'mediumseagreen')
})
```

## toHaveStyleRule

```
expect(element).toHaveStyleRule(property, value?, options?)
```

Asserts that a CSS property has the expected value on a styled component. The `value` argument accepts a string, RegExp, asymmetric matcher (e.g. `expect.stringContaining()`), or `undefined` to assert the property is not set. When used with `.not`, `value` is optional.

```js
const Button = styled.button`
  color: red;
  border: 0.05em solid ${props => props.transparent ? 'transparent' : 'black'};
  cursor: ${props => !props.disabled && 'pointer'};
  opacity: ${props => props.disabled && '.65'};
`

test('default styles', () => {
  const { container } = render(<Button />)
  expect(container.firstChild).toHaveStyleRule('color', 'red')
  expect(container.firstChild).toHaveStyleRule('border', '0.05em solid black')
  expect(container.firstChild).toHaveStyleRule('cursor', 'pointer')
  expect(container.firstChild).not.toHaveStyleRule('opacity')
  expect(container.firstChild).toHaveStyleRule('opacity', undefined)
})

test('prop-dependent styles', () => {
  const { container } = render(<Button disabled transparent />)
  expect(container.firstChild).toHaveStyleRule('border', expect.stringContaining('transparent'))
  expect(container.firstChild).toHaveStyleRule('cursor', undefined)
  expect(container.firstChild).toHaveStyleRule('opacity', '.65')
})
```

### Options

The third argument targets rules within at-rules, with selector modifiers, or by raw CSS selector.

| Option | Type | Description |
|---|---|---|
| `container` | `string` | Match within a `@container` at-rule, e.g. `'(min-width: 400px)'` |
| `layer` | `string` | Match within a `@layer` at-rule, e.g. `'utilities'` |
| `media` | `string` | Match within a `@media` at-rule, e.g. `'(max-width: 640px)'` |
| `supports` | `string` | Match within a `@supports` at-rule, e.g. `'(display: grid)'` |
| `modifier` | `string \| css` | Refine the selector: pseudo-selectors, combinators, `&` references, or the `css` helper for component selectors |
| `namespace` | `string` | Match rules prefixed by a `StyleSheetManager` namespace, e.g. `'#app'` |
| `selector` | `string` | Match by raw CSS selector instead of component class. Useful for `createGlobalStyle` |

### media and modifier

```js
const Button = styled.button`
  @media (max-width: 640px) {
    &:hover {
      color: red;
    }
  }
`

test('media + modifier', () => {
  const { container } = render(<Button />)
  expect(container.firstChild).toHaveStyleRule('color', 'red', {
    media: '(max-width:640px)',
    modifier: ':hover',
  })
})
```

### supports

```js
const Layout = styled.div`
  @supports (display: grid) {
    display: grid;
  }
`

test('supports query', () => {
  const { container } = render(<Layout />)
  expect(container.firstChild).toHaveStyleRule('display', 'grid', {
    supports: '(display:grid)',
  })
})
```

### container

```js
const Card = styled.div`
  container-type: inline-size;
  @container (min-width: 400px) {
    font-size: 1.5rem;
  }
`

test('container query', () => {
  const { container } = render(<Card />)
  expect(container.firstChild).toHaveStyleRule('font-size', '1.5rem', {
    container: '(min-width: 400px)',
  })
})
```

### layer

```js
const Themed = styled.div`
  @layer utilities {
    color: red;
  }
`

test('layer query', () => {
  const { container } = render(<Themed />)
  expect(container.firstChild).toHaveStyleRule('color', 'red', {
    layer: 'utilities',
  })
})
```

### namespace (StyleSheetManager)

When using `StyleSheetManager` with a `namespace` prop, all CSS selectors are prefixed with the namespace. Pass `namespace` so the matcher knows to expect the prefix:

```js
import { StyleSheetManager } from 'styled-components'

const Box = styled.div`
  color: blue;
`

test('namespaced styles', () => {
  const { container } = render(
    <StyleSheetManager namespace="#app">
      <Box />
    </StyleSheetManager>
  )
  expect(container.firstChild).toHaveStyleRule('color', 'blue', {
    namespace: '#app',
  })
})
```

To avoid passing `namespace` on every assertion, set it globally in your setup file:

```js
import { setStyleRuleOptions } from 'jest-styled-components'

setStyleRuleOptions({ namespace: '#app' })
```

This applies to all subsequent `toHaveStyleRule` calls. Individual assertions can still override with their own `namespace` option.

### modifier with component selectors

When a rule targets another styled-component, use the `css` helper:

```js
import { css } from 'styled-components'

const Button = styled.button`
  color: red;
`

const ButtonList = styled.div`
  ${Button} {
    flex: 1 0 auto;
  }
`

test('nested component selector', () => {
  const { container } = render(<ButtonList><Button /></ButtonList>)
  expect(container.firstChild).toHaveStyleRule('flex', '1 0 auto', {
    modifier: css`${Button}`,
  })
})
```

Class name overrides work similarly:

```js
const Button = styled.button`
  background-color: red;
  &.override {
    background-color: blue;
  }
`

test('class override', () => {
  const { container } = render(<Button className="override" />)
  expect(container.firstChild).toHaveStyleRule('background-color', 'blue', {
    modifier: '&.override',
  })
})
```

### selector (createGlobalStyle)

The `selector` option matches rules by raw CSS selector, bypassing component class name detection. This is the way to test `createGlobalStyle`:

```js
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    background: white;
  }
`

test('global styles', () => {
  render(<GlobalStyle />)
  expect(document.documentElement).toHaveStyleRule('background', 'white', {
    selector: 'body',
  })
})
```

When `selector` is set, the component argument is ignored---any rendered element will work as the receiver.

### Element selection

The matcher checks styles on the element it receives. To assert on nested elements, query for them first:

```js
const { getByTestId } = render(<MyComponent />)
expect(getByTestId('inner-button')).toHaveStyleRule('color', 'blue')
```

## React Native

Import the native entry point instead:

```js
import 'jest-styled-components/native'
```

This registers only the `toHaveStyleRule` matcher adapted for React Native's style objects (no snapshot serializer needed). It handles style arrays and converts kebab-case properties to camelCase.

```js
import React from 'react'
import styled from 'styled-components/native'
import renderer from 'react-test-renderer'
import 'jest-styled-components/native'

const Label = styled.Text`
  color: green;
`

test('native styles', () => {
  const tree = renderer.create(<Label />).toJSON()
  expect(tree).toHaveStyleRule('color', 'green')
})
```

## Advanced Usage

### Standalone Serializer

The serializer can be imported separately for use with libraries like [jest-specific-snapshot](https://github.com/igor-dv/jest-specific-snapshot):

```js
import { styleSheetSerializer } from 'jest-styled-components/serializer'
import { addSerializer } from 'jest-specific-snapshot'

addSerializer(styleSheetSerializer)
```

### Serializer Options

```js
import { setStyleSheetSerializerOptions } from 'jest-styled-components/serializer'

setStyleSheetSerializerOptions({
  addStyles: false,                          // omit CSS from snapshots
  classNameFormatter: (index) => `styled${index}`,  // custom class placeholders
})
```

### CSS Parse Caching

By default, `toHaveStyleRule` re-parses the stylesheet on every assertion. For test suites with many assertions, import the cached entry point to parse once and reuse the result when the stylesheet hasn't changed:

```js
import 'jest-styled-components/cache'
```

The cache automatically invalidates when the stylesheet changes and when `resetStyleSheet` runs between tests. No manual cleanup needed.

### resetStyleSheet

The main entry point calls `resetStyleSheet()` in a `beforeEach` hook automatically. If you use the standalone serializer or a custom test setup where `beforeEach` is not globally available, call it manually:

```js
import { resetStyleSheet } from 'jest-styled-components'

resetStyleSheet()
```

## Version Compatibility

| jest-styled-components | styled-components | Test Runner |
|---|---|---|
| 7.2+ | 5.x, 6.x | Jest 27+, Vitest 1+, Bun |
| 7.0--7.1 | 5.x | Jest 27+ |
| 6.x | 4.x--5.x | Jest 24--26 |

## Troubleshooting

### "No style rules found on passed Component"

The most common issue. Check these causes in order:

1. **Wrong element.** The matcher needs the actual DOM element or react-test-renderer JSON node, not a wrapper. With `@testing-library/react`, use `container.firstChild`. With Enzyme, use `mount()` (not `shallow()` for most cases).
2. **Multiple styled-components instances.** Common in monorepos. Run `npm ls styled-components` (or `pnpm why styled-components`) to check. See the [styled-components FAQ](https://www.styled-components.com/docs/faqs#why-am-i-getting-a-warning-about-several-instances-of-module-on-the-page) for resolution.
3. **Version mismatch.** Ensure your jest-styled-components version supports your styled-components version (see [Version Compatibility](#version-compatibility)).

### TypeScript: `toHaveStyleRule` not recognized

The package ships type declarations that augment Jest's `Matchers` interface. If TypeScript doesn't pick them up:

**Jest:** Ensure your `tsconfig.json` includes the package in `types`, or that your setup file import (`import 'jest-styled-components'`) is within the TypeScript project's `include` paths.

**Vitest:** Import from `jest-styled-components/vitest` (not the base entry point). This augments Vitest's `Assertion` interface.

### Styles missing from snapshots

If snapshots show hashed class names instead of CSS rules, the serializer isn't registered. Verify:

1. You're importing `jest-styled-components` (or `jest-styled-components/vitest` for Vitest) in your setup file.
2. The setup file is referenced in your test runner config (`setupFilesAfterEnv` for Jest, `setupFiles` for Vitest).
3. You don't have multiple instances of styled-components loaded (see above).

### Testing `createGlobalStyle`

Global styles don't attach to a specific component. Use the `selector` option to match by CSS selector:

```js
render(<GlobalStyle />)
expect(document.documentElement).toHaveStyleRule('background', 'white', {
  selector: 'body',
})
```

### Jest environment errors (`document is not defined`)

Jest 27+ defaults to the `node` test environment. Add `testEnvironment: 'jsdom'` to your Jest config. For Jest 28+, install `jest-environment-jsdom` as a separate dependency.

## Legacy: Enzyme

[Enzyme](https://github.com/enzymejs/enzyme) is no longer actively maintained. If you still use it, snapshot testing requires [enzyme-to-json](https://www.npmjs.com/package/enzyme-to-json) and `toHaveStyleRule` works with both shallow and mounted wrappers. Consider migrating to `@testing-library/react`.

## Contributing

[Open an issue](https://github.com/styled-components/jest-styled-components/issues/new) to discuss before submitting a PR.

## License

Licensed under the [MIT License](LICENSE).
