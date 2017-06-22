[![Build Status](https://travis-ci.org/styled-components/jest-styled-components.svg?branch=master)](https://travis-ci.org/styled-components/jest-styled-components)

# Jest Styled Components
[Jest](https://github.com/facebook/jest) utilities for [Styled Components](https://github.com/styled-components/styled-components).

## Installation


```
yarn add --dev jest-styled-components
```

To render React components for testing you can use either `react-test-renderer` or `enzyme`.

**Using react-test-renderer**


Installation:

```
yarn add --dev react-test-renderer
```

Usage:

```js
import renderer from 'react-test-renderer'

// somewhere in your tests
test('matches the styled components snapshot', () => {
  const tree = renderer.create(<MyComponent />).toJSON()
  expect(tree).toMatchStyledComponentsSnapshot()
  expect(tree).toHaveStyleRule('display', 'block')
})
```



**Using enzyme and enzyme-to-json**

Installation:

```
yarn add --dev enzyme enzyme-to-json
```

Usage:


```js
import {mount} from 'enzyme'
import toJSON from 'enzyme-to-json'

// inside your test
test('can use enzyme instead of react-test-renderer', () => {
  const wrapper = mount(<MyComponent />)
  const tree = toJSON(wrapper)

  const selector = '.btn-primary'
  const subject = wrapper.find(selector)
  expect(subject).toHaveStyleRule('color', 'whitesmoke')
  expect(tree).toMatchStyledComponentsSnapshot()
})
```

`enzyme-to-json` is only needed for snapshot testing, to learn more about snapshot testing with enzyme, go [here](https://www.npmjs.com/package/enzyme-to-json)


## toMatchStyledComponentsSnapshot [React]

Learn more about Snapshot Testing with Jest [here](https://facebook.github.io/jest/docs/snapshot-testing.html), this matcher
is used to assert complex selectors or to test your entire component in one go.


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

Only checks for the styles directly applied to the component it receives, to assert that a complex selector has been applied to
a component, use `toMatchStyledComponentsSnapshot` instead.


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

