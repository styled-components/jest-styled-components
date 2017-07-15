import React from 'react'
import renderer from 'react-test-renderer'
import styled, { ThemeProvider } from 'styled-components'
import { shallow, mount } from 'enzyme'
import '../src'

const toHaveStyleRule = (component, property, value) => {
  expect(renderer.create(component).toJSON()).toHaveStyleRule(property, value)
  expect(shallow(component)).toHaveStyleRule(property, value)
  expect(mount(component)).toHaveStyleRule(property, value)
}

test('basic', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `

  toHaveStyleRule(<Wrapper />, 'background', 'papayawhip')
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
