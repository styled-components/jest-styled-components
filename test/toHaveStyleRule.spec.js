import React from 'react'
import renderer from 'react-test-renderer'
import styled, { ThemeProvider } from 'styled-components'
import { shallow, mount } from 'enzyme'
import '../src'

const notToHaveStyleRule = (component, property, value) => {
  expect(renderer.create(component).toJSON()).not.toHaveStyleRule(
    property,
    value
  )
  expect(shallow(component)).not.toHaveStyleRule(property, value)
  expect(mount(component)).not.toHaveStyleRule(property, value)
}

const toHaveStyleRule = (component, property, value, options) => {
  expect(renderer.create(component).toJSON()).toHaveStyleRule(
    property,
    value,
    options
  )
  expect(shallow(component)).toHaveStyleRule(property, value, options)
  expect(mount(component)).toHaveStyleRule(property, value, options)
}

test('message when property not found', () => {
  expect(() => expect(null).toHaveStyleRule('a')).toThrowErrorMatchingSnapshot()
})

test('null', () => {
  expect(null).not.toHaveStyleRule('a', 'b')
})

test('non-styled', () => {
  notToHaveStyleRule(<div />, 'a', 'b')
})

test('message when value does not match', () => {
  const Wrapper = styled.section`
    background: orange;
  `

  expect(() => {
    expect(renderer.create(<Wrapper />).toJSON()).toHaveStyleRule(
      'background',
      'red'
    )
  }).toThrowErrorMatchingSnapshot()
})

test('basic', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `

  toHaveStyleRule(<Wrapper />, 'background', 'papayawhip')
})

test('regex', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `

  toHaveStyleRule(<Wrapper />, 'background', /^p/)
})

test('any component', () => {
  const Link = ({ className, children }) => (
    <a className={className}>{children}</a>
  )

  const StyledLink = styled(Link)`
    color: palevioletred;
    font-weight: bold;
  `

  toHaveStyleRule(
    <StyledLink>Styled, exciting Link</StyledLink>,
    'color',
    'palevioletred'
  )
})

test('styled child', () => {
  const Parent = styled.div`
    color: red;
  `

  const StyledChild = styled(Parent)`
    padding: 0;
  `

  toHaveStyleRule(<StyledChild />, 'color', 'red')
})

test('extending styles', () => {
  const Button = styled.button`
    color: palevioletred;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  `

  const TomatoButton = Button.extend`
    color: tomato;
    border-color: tomato;
  `

  toHaveStyleRule(<TomatoButton>Tomato Button</TomatoButton>, 'color', 'tomato')
})

test('theming', () => {
  const Button = styled.button`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;

    color: ${props => props.theme.main};
    border: 2px solid ${props => props.theme.main};
  `

  Button.defaultProps = {
    theme: {
      main: 'palevioletred',
    },
  }

  const theme = {
    main: 'mediumseagreen',
  }

  toHaveStyleRule(<Button>Normal</Button>, 'color', 'palevioletred')

  const component = (
    <ThemeProvider theme={theme}>
      <Button>Themed</Button>
    </ThemeProvider>
  )

  expect(renderer.create(component).toJSON()).toHaveStyleRule(
    'color',
    'mediumseagreen'
  )
  expect(mount(component)).toHaveStyleRule('color', 'mediumseagreen')
})

test('at rules', () => {
  const Wrapper = styled.section`
    color: red;
    @media (max-width: 640px) {
      color: green;
    }
  `

  toHaveStyleRule(<Wrapper />, 'color', 'red')
  toHaveStyleRule(<Wrapper />, 'color', 'green', {
    media: '(max-width:640px)',
  })
})

test('selector modifiers', () => {
  const Link = styled.a`
    color: white;

    &:hover {
      color: blue;
    }
    &::after {
      color: red;
    }
    &[href*='somelink.com'] {
      color: green;
    }
    > div {
      color: yellow;
    }
    span {
      color: purple;
    }
    .child {
      color: orange;
    }
    &.self {
      color: black;
    }

    .one,
    .two {
      color: olive;
    }

    ~ div {
      &.one,
      &.two {
        color: pink;
      }
    }

    + div {
      .one,
      .two {
        color: salmon;
      }
    }

    .parent & {
      color: red;
    }
  `

  toHaveStyleRule(<Link />, 'color', 'white')
  toHaveStyleRule(<Link />, 'color', 'blue', {
    modifier: ':hover',
  })
  toHaveStyleRule(<Link />, 'color', 'red', {
    modifier: '::after',
  })
  toHaveStyleRule(<Link />, 'color', 'green', {
    modifier: "[href*='somelink.com']",
  })
  toHaveStyleRule(<Link />, 'color', 'yellow', {
    modifier: '> div',
  })
  toHaveStyleRule(<Link />, 'color', 'purple', {
    modifier: 'span',
  })
  toHaveStyleRule(<Link />, 'color', 'purple', {
    modifier: ' span',
  })
  toHaveStyleRule(<Link />, 'color', 'orange', {
    modifier: '.child',
  })
  toHaveStyleRule(<Link />, 'color', 'orange', {
    modifier: ' .child',
  })
  toHaveStyleRule(<Link />, 'color', 'black', {
    modifier: '&.self',
  })
  toHaveStyleRule(<Link />, 'color', 'olive', {
    modifier: '.one',
  })
  toHaveStyleRule(<Link />, 'color', 'olive', {
    modifier: '.two',
  })
  toHaveStyleRule(<Link />, 'color', 'pink', {
    modifier: '~ div.one',
  })
  toHaveStyleRule(<Link />, 'color', 'salmon', {
    modifier: '+ div .two',
  })
  toHaveStyleRule(<Link />, 'color', 'red', {
    modifier: '.parent &',
  })
})
