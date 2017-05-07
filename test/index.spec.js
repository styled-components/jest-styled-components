/**
 * @jest-environment node
 */

import React from 'react'
import renderer from 'react-test-renderer'
import styled from 'styled-components'
import { shallow } from 'enzyme'
import '../src'

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;

  &:hover {
    text-decoration: underline;
  }

  @media (min-width: 600px) {
    color: blue;
  }

  em {
    color: green;
  }
`

test('react-test-renderer', () => {
  const tree = renderer.create(
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
    </Wrapper>,
  ).toJSON()

  expect(tree).toMatchStyledComponentsSnapshot()
})

test('enzyme', () => {
  const tree = shallow(
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
    </Wrapper>,
  )

  expect(tree).toMatchStyledComponentsSnapshot()
})
