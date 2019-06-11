import React from 'react';
import render from 'preact-render-to-json';
import styled from 'styled-components';
import '../../src';

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

  const tree = render(
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
    </Wrapper>
  );

  expect(tree).toMatchSnapshot();
});
