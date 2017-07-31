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

test('null', () => {
  expect(null).not.toHaveStyleRule('a', 'b')
})

test('non-styled', () => {
  notToHaveStyleRule(<div />, 'a', 'b')
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
  const Link = ({ className, children }) =>
    <a className={className}>
      {children}
    </a>

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

test('media queries', () => {
  const Text = styled.a`
    font-size: 2em;
    color: white;
    @media (max-width: 640px) {
      font-size: 1.5em;
    }
    @media (max-width: 1080px) {
      font-size: 1em;
    }
    @media (min-width: 480px) and (max-width: 920px) {
      color: black;
    }
  `

  toHaveStyleRule(<Text>Text with styles</Text>, 'font-size', '2em')
  toHaveStyleRule(<Text>Text with styles</Text>, 'color', 'white')
  toHaveStyleRule(<Text>Text with styles</Text>, 'font-size', '1.5em', {
    media: '(max-width: 640px)',
  })
  toHaveStyleRule(<Text>Text with styles</Text>, 'font-size', '1em', {
    media: '(max-width: 1080px)',
  })
  toHaveStyleRule(<Text>Text with styles</Text>, 'color', 'black', {
    media: '(min-width: 480px) and (max-width: 920px)',
  })
})
