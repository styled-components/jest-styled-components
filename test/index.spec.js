import React from 'react'
import renderer from 'react-test-renderer'
import styled from 'styled-components'
import { matcher, serializer } from '../src'

expect.addSnapshotSerializer(serializer)
expect.extend(matcher)

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`

test('it works', () => {
  const tree = renderer.create(
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
    </Wrapper>,
  ).toJSON()

  expect(tree).toMatchStyledComponentsSnapshot()
})
