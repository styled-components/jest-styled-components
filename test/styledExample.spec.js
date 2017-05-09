/**
 * @jest-environment node
 */

import React from 'react'
import styled from 'styled-components'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import '../src'

const Button = styled.button`
  background: palevioletred;
  border-radius: 3px;
  border: none;
  color: white;
`

const TomatoButton = styled(Button)`
  background: tomato;
`

test('enzyme', () => {
  const tree = shallow(
    <TomatoButton>
      Hello World!
    </TomatoButton>,
  )

  expect(tree).toMatchStyledComponentsSnapshot()
})

test('react-test-renderer', () => {
  const tree = renderer
    .create(
      <TomatoButton>
        Hello World!
      </TomatoButton>,
    )
    .toJSON()

  expect(tree).toMatchStyledComponentsSnapshot()
})
