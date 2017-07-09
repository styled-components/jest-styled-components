import React from 'react'
import renderer from 'react-test-renderer'
import styled from 'styled-components'
import { shallow, mount } from 'enzyme'
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

  @supports (display: grid) {
    display: grid;
  }

  em {
    color: green;
  }
`

const SuperWrapper = styled(Wrapper)`
  background: red;
`

describe('toMatchSnapshot', () => {
  test('null', () => {
    expect(null).toMatchSnapshot()
  })

  test('test-renderer', () => {
    const tree = renderer.create(
      <Wrapper>
        <Title>Hello World, this is my first styled component!</Title>
      </Wrapper>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('shallow', () => {
    const tree = shallow(
      <Wrapper>
        <Title>Hello World, this is my first styled component!</Title>
      </Wrapper>
    )

    expect(tree).toMatchSnapshot()
  })

  test('mount', () => {
    const tree = mount(
      <Wrapper>
        <Title>Hello World, this is my first styled component!</Title>
      </Wrapper>
    )

    expect(tree).toMatchSnapshot()
  })
})

describe('toHaveStyleRule', () => {
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
})
