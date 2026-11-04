import { createElement } from 'react';
import renderer from 'react-test-renderer';
import { createGlobalStyle } from 'styled-components';
import { expect, it } from 'vitest';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

it('finds a createGlobalStyle rule', () => {
  renderer.create(createElement(GlobalStyle));

  expect(null).toHaveStyleRule('margin', '0', { selector: 'body' });
});
