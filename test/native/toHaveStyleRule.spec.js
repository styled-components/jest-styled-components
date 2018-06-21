import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import styled, { ThemeProvider } from 'styled-components/native'
import '../../native'

test('basic', () => {
  const StyledView = styled.View`
    background-color: papayawhip;
  `
  const tree = renderer.create(<StyledView />).toJSON()

  expect(tree).toHaveStyleRule('background-color', 'papayawhip')
})

test('message when property not found', () => {
  const Button = styled.Text`
    background-color: papayawhip;
  `

  expect(() =>
    expect(renderer.create(<Button />).toJSON()).toHaveStyleRule(
      'color',
      'black'
    )
  ).toThrowErrorMatchingSnapshot()
})

test('message when value does not match', () => {
  const StyledView = styled.View`
    background-color: orange;
  `

  expect(() => {
    expect(renderer.create(<StyledView />).toJSON()).toHaveStyleRule(
      'background-color',
      'red'
    )
  }).toThrowErrorMatchingSnapshot()
})

test('basic', () => {
  const StyledView = styled.View`
    padding: 4px;
    background-color: papayawhip;
  `

  expect(renderer.create(<StyledView />).toJSON()).toHaveStyleRule(
    'background-color',
    'papayawhip'
  )
})

test('regex', () => {
  const StyledView = styled.View`
    padding: 4px;
    background-color: papayawhip;
  `

  expect(renderer.create(<StyledView />).toJSON()).toHaveStyleRule(
    'background-color',
    /^papaya/
  )
})

test('undefined', () => {
  const Button = styled.Text`
    ${({ transparent }) => !transparent && 'background-color: papayawhip;'};
  `

  expect(renderer.create(<Button />).toJSON()).toHaveStyleRule(
    'background-color',
    'papayawhip'
  )
  expect(renderer.create(<Button transparent />).toJSON()).toHaveStyleRule(
    'background-color',
    undefined
  )
})

test('jest asymmetric matchers', () => {
  const Button = styled.Text`
    background-color: ${({ transparent }) =>
      transparent ? 'transparent' : 'papayawhip'};
  `

  expect(renderer.create(<Button />).toJSON()).toHaveStyleRule(
    'background-color',
    expect.any(String)
  )
  expect(renderer.create(<Button />).toJSON()).toHaveStyleRule(
    'background-color',
    expect.stringMatching('papayawhip')
  )
  expect(renderer.create(<Button />).toJSON()).toHaveStyleRule(
    'background-color',
    expect.stringMatching(/^papaya/)
  )
  expect(renderer.create(<Button transparent />).toJSON()).toHaveStyleRule(
    'background-color',
    expect.stringContaining('transparent')
  )
  expect(renderer.create(<Button transparent />).toJSON()).not.toHaveStyleRule(
    'color',
    expect.any(String)
  )
  expect(renderer.create(<Button transparent />).toJSON()).not.toHaveStyleRule(
    'color',
    expect.anything()
  )
})

test('styled child', () => {
  const Parent = styled.Text`
    color: red;
  `
  const StyledChild = styled(Parent)`
    padding: 0;
  `

  expect(renderer.create(<StyledChild />).toJSON()).toHaveStyleRule(
    'color',
    'red'
  )
})

test('extending styles', () => {
  const Button = styled.Text`
    color: palevioletred;
    font-size: 1px;
    margin: 1px;
    padding: 0.25px 1px;
    border: 2px solid palevioletred;
    border-radius: 3px;
  `

  const TomatoButton = Button.extend`
    color: tomato;
    border-color: tomato;
  `

  expect(renderer.create(<TomatoButton />).toJSON()).toHaveStyleRule(
    'color',
    'tomato'
  )
})

test('theming', () => {
  const Button = styled.Text`
    font-size: 1px;
    margin: 1px;
    padding: 0.25px 1px;
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

  expect(renderer.create(<Button>Normal</Button>).toJSON()).toHaveStyleRule(
    'color',
    'palevioletred'
  )

  const component = (
    <ThemeProvider theme={theme}>
      <Button>Themed</Button>
    </ThemeProvider>
  )

  expect(renderer.create(component).toJSON()).toHaveStyleRule(
    'color',
    'mediumseagreen'
  )
})
