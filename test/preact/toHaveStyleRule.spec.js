import React from 'react';
import render from 'preact-render-to-json';
import styled from 'styled-components';
import '../../src';

it('basic', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  const tree = render(<Wrapper />);

  expect(tree).toHaveStyleRule('background', 'papayawhip');
});
