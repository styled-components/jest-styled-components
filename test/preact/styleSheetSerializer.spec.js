import { mount, shallow } from 'enzyme';
import React from 'react';
import styled from 'styled-components';

const toMatchSnapshot = (component) => {
  expect(shallow(component)).toMatchSnapshot('shallow');
  expect(mount(component)).toMatchSnapshot('mount');
};

it('basic', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `;

  toMatchSnapshot(
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
    </Wrapper>
  );
});
