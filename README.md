[![Build Status](https://travis-ci.org/styled-components/jest-styled-components.svg?branch=master)](https://travis-ci.org/styled-components/jest-styled-components)

# Jest Styled Components
[Jest](https://github.com/facebook/jest) utilities for [Styled Components](https://github.com/styled-components/styled-components).

## Installation


```
yarn add --dev jest-styled-components
```

This package must be used with either `react-test-renderer` or `enzyme` and `enzyme-to-json` to generate a serialized `tree` from your component.

**Using react-test-renderer**


Installation:

```
yarn add --dev react-test-renderer
```

Usage:

```js
import renderer from 'react-test-renderer'

// somewhere in your tests
it('matches the styled components snapshot', () => {
  const tree = renderer.create(<MyComponent />).toJSON()
  expect(tree).toMatchStyledComponentsSnapshot()
  expect(tree).toHaveStyleRule('display', 'block')
})
```

For more info on using react-test-renderer with jest for snapshots see [this](https://facebook.github.io/jest/docs/snapshot-testing.html)


**Using enzyme's mount and enzyme-to-json**

Installation:

```
yarn add --dev enzyme enzyme-to-json
```

Usage:

This module is not compatible with shallow rendering, components must use the full DOM rendering with `mount`

```js
import {mount} from 'enzyme'
import toJSON from 'enzyme-to-json'

// inside your test
it('can use enzyme instead of react-test-renderer', () => {
  const wrapper = mount(<MyComponent />)
  const tree = toJSON(wrapper)

  expect(tree).toMatchStyledComponentsSnapshot()
  expect(tree).toHaveStyleRule('display', 'block')
})
```

## toMatchStyledComponentsSnapshot [React]

### Preview

<img alt="Preview" src="assets/toMatchStyledComponentsSnapshot.png" width="500px" height="500px" />

### Usage

```js
// *.spec.js

import 'jest-styled-components'

// ...

expect(tree).toMatchStyledComponentsSnapshot()
```

## toHaveStyleRule [React]

Only checks for the styles directly applied to the component it receives, to assert that a style has been applied to a child
component, use `toMatchStyledComponentsSnapshot`

### Preview

<img alt="Preview" src="assets/toHaveStyleRule.png" width="470px" height="85px" />

### Usage

```js
// *.spec.js

import 'jest-styled-components'

// ...

expect(tree).toHaveStyleRule('property', value)
```

## toHaveStyleRule [React Native]


### Preview

<img alt="Preview" src="assets/toHaveStyleRule1.png" width="440px" height="140px" />

<img alt="Preview" src="assets/toHaveStyleRule2.png" width="440px" height="140px" />

### Usage

```js
// *.spec.js

import 'jest-styled-components/native'

// ...

expect(tree).toHaveStyleRule('property', value)
```
