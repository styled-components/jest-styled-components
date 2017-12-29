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

xtest('message when property not found', () => {
  expect(() => expect(null).toHaveStyleRule('a')).toThrowErrorMatchingSnapshot()
})

xtest('null', () => {
  expect(null).not.toHaveStyleRule('a', 'b')
})

test('message when value does not match', () => {
  const StyledView = styled.View`
    background: orange;
  `

  expect(() => {
    expect(renderer.create(<StyledView />).toJSON()).toHaveStyleRule(
      'background',
      'red'
    )
  }).toThrowErrorMatchingSnapshot()
})

xtest('basic', () => {
  const StyledView = styled.View`
    padding: 4px;
    background: papayawhip;
  `

  expect(renderer.create(<StyledView />).toJSON()).toHaveStyleRule(
    'background',
    'papayawhip'
  )
})

xtest('regex', () => {
  const StyledView = styled.View`
    padding: 4px;
    background: papayawhip;
  `

  expect(renderer.create(<StyledView />).toJSON()).toHaveStyleRule(
    'background',
    /^p/
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
