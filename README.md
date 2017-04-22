[![Build Status](https://travis-ci.org/styled-components/jest-styled-components.svg?branch=master)](https://travis-ci.org/styled-components/jest-styled-components)

# Jest Styled Components
[Jest](https://github.com/facebook/jest) utilities for [Styled Components](https://github.com/styled-components/styled-components).

## Preview

<img alt="Preview" src="screenshot.png" width="500px" height="505px" />

## Installation

```
yarn add --dev jest-styled-components
```

## Usage

### For web
```js
// package.json

"jest": {
  "testEnvironment": "node"
}
```

```js
// *.spec.js

import { matcher, serializer } from 'jest-styled-components'

expect.extend(matcher)
expect.addSnapshotSerializer(serializer)

// ...

expect(tree).toMatchStyledComponentsSnapshot()
```

### For native

Import matcher in your .spec.js file:

```js
import 'jest-styled-components/native'
```

That's it! You're ready to use `.toHaveStyleRule(rule, expectedValue)` matcher:

```js
describe('Avatar', () => {
  it('uses default size property (64) to calculate proper border radius (32)', () =>
    expect(shallow(<Avatar />)).toHaveStyleRule('border-radius', 32)
  )
})
```

### Assertation messages

- Wrong value
![](https://snag.gy/4Z07wJ.jpg)

- Missing rule
![](https://snag.gy/gbOw1J.jpg)