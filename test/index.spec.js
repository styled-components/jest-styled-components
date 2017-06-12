import React from 'react'
import renderer from 'react-test-renderer'
import styled from 'styled-components'
import { shallow, mount } from 'enzyme'
import '../src'
import { StyledLabel } from './components'

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

describe('toMatchSnapshot', () => {
  test('null', () => {
    expect(null).toMatchSnapshot()
  })

  test('test-renderer', () => {
    const tree = renderer.create(
      <Wrapper>
        <Title>Hello World, this is my first styled component!</Title>
      </Wrapper>,
    ).toJSON()

    expect(tree).toMatchStyledComponentsSnapshot()
  })

  test('shallow', () => {
    const tree = shallow(
      <Wrapper>
        <Title>Hello World, this is my first styled component!</Title>
      </Wrapper>,
    )

    expect(tree).toMatchStyledComponentsSnapshot()
  })

  test('when horizontal must be display:inline', () => {
    // given
    const text = 'text'
    // when
    const component = mount(<StyledLabel horizontal>{text}</StyledLabel>)
    // then
    expect(component).toMatchStyledComponentsSnapshot()
  })
})

describe('toHaveStyleRule', () => {
  test('test-renderer', () => {
    const tree = renderer.create(<Wrapper />).toJSON()

    expect(tree).toHaveStyleRule('background', 'papayawhip')
  })

  test('mount', () => {
    const tree = mount(<Wrapper />)

    expect(tree).toHaveStyleRule('background', 'papayawhip')
  })

  test('when horizontal must be display:inline', () => {
    // given
    const text = 'text'
    // when
    const component = mount(<StyledLabel horizontal>{text}</StyledLabel>)
    // then
    expect(component).toHaveStyleRule('display', 'inline')
  })
})
