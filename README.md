[![NPM version](https://img.shields.io/npm/v/jest-styled-components.svg)](https://www.npmjs.com/package/jest-styled-components)
[![CI](https://github.com/styled-components/jest-styled-components/actions/workflows/ci.yml/badge.svg)](https://github.com/styled-components/jest-styled-components/actions/workflows/ci.yml)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# Jest Styled Components

A set of utilities for testing [Styled Components](https://github.com/styled-components/styled-components) (v5+) with [Jest](https://github.com/facebook/jest). Provides a snapshot serializer that inlines CSS into snapshots and a `toHaveStyleRule` matcher for asserting style rules.

## Quick Start

```sh
npm install --save-dev jest-styled-components
```

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

To avoid importing in every test file, use the [global setup](#global-setup) method.

## Table of Contents

- [Snapshot Testing](#snapshot-testing)
- [toHaveStyleRule](#tohavestylerule)
- [Vitest](#vitest)
- [React Native](#react-native)
- [Global Setup](#global-setup)
- [Serializer](#serializer)
- [Legacy: Enzyme](#legacy-enzyme)

## Snapshot Testing

Without this package, styled-components snapshots contain opaque hashed class names and no CSS rules. Changes to styles only show up as class name diffs, which is uninformative.

After importing `jest-styled-components`, snapshots include the actual CSS rules and use deterministic class name placeholders (`c0`, `c1`, etc.), producing clear diffs 💖:

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

### @testing-library/react

```js
import { render } from '@testing-library/react'

test('it works', () => {
  const { container } = render(<Button />)
  expect(container.firstChild).toMatchSnapshot()
})
```

Snapshots from DOM elements use `class` instead of `className`.

### react-test-renderer

```js
import renderer from 'react-test-renderer'

test('it works', () => {
  const tree = renderer.create(<Button />).toJSON()
  expect(tree).toMatchSnapshot()
})
```

### Theming

Pass the theme directly as a prop or wrap with `ThemeProvider`:

```js
import { ThemeProvider } from 'styled-components'

const theme = { main: 'mediumseagreen' }

test('with theme prop', () => {
  const { container } = render(<Button theme={theme} />)
  expect(container.firstChild).toHaveStyleRule('color', 'mediumseagreen')
})

test('with ThemeProvider', () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Button />
    </ThemeProvider>
  )
  expect(container.firstChild).toHaveStyleRule('color', 'mediumseagreen')
})
```

## toHaveStyleRule

Asserts that a CSS property has the expected value. The second argument accepts a string, RegExp, Jest asymmetric matcher, or `undefined`. When used with `.not`, the second argument is optional.

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

The third argument is an options object for targeting rules within at-rules, with modifiers, or by raw CSS selector.

| Option | Type | Description |
|---|---|---|
| `media` | `string` | Match within a `@media` at-rule, e.g. `'(max-width: 640px)'` |
| `supports` | `string` | Match within a `@supports` at-rule, e.g. `'(display: grid)'` |
| `modifier` | `string \| css` | Refine the selector: pseudo-selectors, combinators, `&` references, or the `css` helper for component selectors |
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

### modifier with component selectors

When a rule is nested within another styled-component, use the `css` helper to target it:

```js
const Button = styled.button`
  color: red;
`

const ButtonList = styled.div`
  ${Button} {
    flex: 1 0 auto;
  }
`

import { css } from 'styled-components'

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

When `selector` is set, the component argument to `toHaveStyleRule` is ignored -- any rendered element will work as the receiver.

### Note on element selection

The matcher checks styles on the root element it receives. To assert on nested elements, query for them first:

```js
const { getByTestId } = render(<MyComponent />)
expect(getByTestId('inner-button')).toHaveStyleRule('color', 'blue')
```

## Vitest

Import the Vitest-specific entry point in your setup file:

```js
import 'jest-styled-components/vitest'
```

This registers the serializer, matcher, and stylesheet reset using Vitest's `expect` and `beforeEach`. TypeScript types are included at `jest-styled-components/vitest`.

Configure in `vitest.config.ts`:

```js
export default defineConfig({
  test: {
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

## Bun

Works with Bun's test runner out of the box. Import `jest-styled-components` in your test setup as usual -- Bun provides the `expect` and `beforeEach` globals that the library hooks into.

## React Native

For React Native, import the native entry point instead:

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

## Global Setup

To avoid importing in every test file, create a setup file:

```js
// src/setupTests.js
import 'jest-styled-components'
```

Then add it to your Jest config:

```js
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
}
```

## Serializer

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

### resetStyleSheet

The main entry point calls `resetStyleSheet()` in a `beforeEach` hook automatically. If you use the standalone serializer or a custom test setup where `beforeEach` is not globally available, call it manually:

```js
import { resetStyleSheet } from 'jest-styled-components'

// In your test setup or beforeEach
resetStyleSheet()
```

### CSS Parse Caching

By default, `toHaveStyleRule` re-parses the stylesheet on every assertion. For test suites with many assertions, this can be slow. Import the cached entry point to parse once and reuse the result when the stylesheet hasn't changed:

```js
import 'jest-styled-components/cache'
```

That's it—the cache automatically invalidates when the stylesheet changes (new components render) and when `resetStyleSheet` runs between tests via `beforeEach`. No manual cleanup needed.

With the cached entry point, both `toHaveStyleRule` and the snapshot serializer reuse the parsed stylesheet when possible. The serializer builds a filtered copy of the AST instead of mutating it during serialization.

## Legacy: Enzyme

[Enzyme](https://github.com/enzymejs/enzyme) is no longer actively maintained. If you still use it, snapshot testing requires [enzyme-to-json](https://www.npmjs.com/package/enzyme-to-json) and `toHaveStyleRule` works with both shallow and mounted wrappers. Consider migrating to `@testing-library/react`.

## Working with Multiple Packages

If styles are not appearing in snapshots, you may have multiple instances of `styled-components` loaded (common in monorepos). See the styled-components FAQ: [Why am I getting a warning about several instances of module on the page?](https://www.styled-components.com/docs/faqs#why-am-i-getting-a-warning-about-several-instances-of-module-on-the-page)

## Contributing

[Open an issue](https://github.com/styled-components/jest-styled-components/issues/new) to discuss before submitting a PR.

## Contributors

This project exists thanks to all the people who contribute.

<a href="https://github.com/styled-components/jest-styled-components/graphs/contributors"><img src="https://opencollective.com/styled-components/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! [[Become a backer](https://opencollective.com/styled-components#backer)]

<a href="https://opencollective.com/styled-components#backers" target="_blank"><img src="https://opencollective.com/styled-components/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. [[Become a sponsor](https://opencollective.com/styled-components#sponsor)]

<a href="https://opencollective.com/styled-components#sponsors" target="_blank"><img src="https://opencollective.com/styled-components/sponsors.svg?width=890"></a>

## License

Licensed under the MIT License.
