import { createElement } from 'react';
import renderer from 'react-test-renderer';
import styled from 'styled-components';
import { expect, it } from 'vitest';

const Button = styled.button`
  color: red;
`;

it('finds a styled component rule', () => {
  const tree = renderer.create(createElement(Button)).toJSON();

  expect(tree).toHaveStyleRule('color', 'red');
});

it('inlines the rule into a snapshot', () => {
  const tree = renderer.create(createElement(Button)).toJSON();

  expect(tree).toMatchInlineSnapshot(`
    .c0 {
      color: red;
    }

    <button
      className="c0"
    />
  `);
});
