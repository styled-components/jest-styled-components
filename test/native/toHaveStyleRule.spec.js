import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import styled from 'styled-components/native'
import '../../native'

test('basic', () => {
  const StyledView = styled.View`
    background-color: papayawhip;
  `

  const tree = renderer.create(<StyledView />).toJSON()

  expect(tree).toHaveStyleRule('background-color', 'papayawhip')
})
