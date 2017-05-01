[![Build Status](https://travis-ci.org/styled-components/jest-styled-components.svg?branch=master)](https://travis-ci.org/styled-components/jest-styled-components)

# Jest Styled Components
[Jest](https://github.com/facebook/jest) utilities for [Styled Components](https://github.com/styled-components/styled-components).

## Installation

```
yarn add --dev jest-styled-components
```

## React

### Preview

<img alt="Preview" src="assets/toMatchStyledComponentsSnapshot.png" width="500px" height="500px" />

### Usage

```js
// package.json

"jest": {
  "testEnvironment": "node"
}
```

```js
// *.spec.js

import 'jest-styled-components'

// ...

expect(tree).toMatchStyledComponentsSnapshot()
```
## React Native

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
