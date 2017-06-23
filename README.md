[![Build Status](https://travis-ci.org/styled-components/jest-styled-components.svg?branch=master)](https://travis-ci.org/styled-components/jest-styled-components)

# Jest Styled Components
[Jest](https://github.com/facebook/jest) utilities for [Styled Components](https://github.com/styled-components/styled-components).

## Installation

```
yarn add --dev jest-styled-components
```

To render React components for testing you can use either `react-test-renderer` or `enzyme`.

### Using react-test-renderer

Installation:

```
yarn add --dev react-test-renderer
```

Usage:

```js
import renderer from 'react-test-renderer'

test('with react-test-renderer', () => {
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
import { shallow, mount } from 'enzyme'
import toJSON from 'enzyme-to-json'

test('with enzyme', () => {
  const wrapper = shallow(<MyComponent />) // or mount(<MyComponent />)
  const subject = wrapper.find('.btn-primary')
  expect(subject).toHaveStyleRule('color', 'whitesmoke')
  
  const tree = toJSON(wrapper)
  expect(tree).toMatchStyledComponentsSnapshot()
})
```

[enzyme-to-json](https://www.npmjs.com/package/enzyme-to-json) is needed for snapshot testing only.


## toMatchStyledComponentsSnapshot [React]

[Learn more](https://facebook.github.io/jest/docs/snapshot-testing.html) about Snapshot Testing with Jest. This matcher
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

Only checks for the styles directly applied to the component it receives, to assert that a complex selector has been applied to a component, use `toMatchStyledComponentsSnapshot` instead.

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
