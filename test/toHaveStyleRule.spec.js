import React from 'react'
import renderer from 'react-test-renderer'
import styled from 'styled-components'
import { shallow, mount } from 'enzyme'
import '../src'

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`

const SuperWrapper = styled(Wrapper)`
  background: red;
`

test('test-renderer', () => {
  const tree = renderer.create(<Wrapper />).toJSON()

  expect(tree).toHaveStyleRule('background', 'papayawhip')
})

test('test-renderer (override)', () => {
  const tree = renderer.create(<SuperWrapper />).toJSON()

  expect(tree).toHaveStyleRule('background', 'red')
})

test('shallow', () => {
  const tree = shallow(<Wrapper />)

  expect(tree).toHaveStyleRule('background', 'papayawhip')
})

test('mount', () => {
  const tree = mount(<Wrapper />)

  expect(tree).toHaveStyleRule('background', 'papayawhip')
})
