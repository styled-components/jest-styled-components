import { describe, it, expect } from 'vitest';
import React from 'react';
import renderer from 'react-test-renderer';
import styled, { css, ThemeProvider } from 'styled-components';
import 'jest-styled-components/vitest';

const toHaveStyleRule = (component, property, value, options) => {
  expect(renderer.create(component).toJSON()).toHaveStyleRule(
    property,
    value,
    options
  );
};

describe('toHaveStyleRule (vitest, no globals)', () => {
  it('basic', () => {
    const Wrapper = styled.section`
      padding: 4em;
      background: papayawhip;
    `;

    toHaveStyleRule(<Wrapper />, 'background', 'papayawhip');
  });

  it('regex', () => {
    const Wrapper = styled.section`
      padding: 4em;
      background: papayawhip;
    `;

    toHaveStyleRule(<Wrapper />, 'background', /^p/);
  });

  it('asymmetric matcher', () => {
    const Wrapper = styled.section`
      background: papayawhip;
    `;

    toHaveStyleRule(
      <Wrapper />,
      'background',
      expect.stringContaining('whip')
    );
  });

  it('complex string', () => {
    const Wrapper = styled.section`
      border: 1px solid rgba(0, 0, 0, 0.125);
    `;

    toHaveStyleRule(<Wrapper />, 'border', '1px solid rgba(0,0,0,0.125)');
  });

  it('undefined', () => {
    const Button = styled.button`
      cursor: ${({ disabled }) => !disabled && 'pointer'};
      opacity: ${({ disabled }) => disabled && '.65'};
    `;

    toHaveStyleRule(<Button />, 'opacity', undefined);
    toHaveStyleRule(<Button />, 'cursor', 'pointer');
    toHaveStyleRule(<Button disabled />, 'opacity', '.65');
    toHaveStyleRule(<Button disabled />, 'cursor', undefined);
  });

  it('negated ".not"', () => {
    const Button = styled.button`
      opacity: ${({ disabled }) => disabled && '.65'};
    `;

    expect(renderer.create(<Button />).toJSON()).not.toHaveStyleRule('opacity');
  });

  it('css helper modifier', () => {
    const Link = styled.a`
      color: white;

      ${css`
        &:hover {
          color: blue;
        }
      `}
    `;

    toHaveStyleRule(<Link />, 'color', 'blue', { modifier: ':hover' });
  });

  it('media query', () => {
    const Button = styled.button`
      color: red;

      @media (max-width: 640px) {
        color: green;
      }
    `;

    toHaveStyleRule(<Button />, 'color', 'red');
    toHaveStyleRule(<Button />, 'color', 'green', {
      media: '(max-width: 640px)',
    });
  });

  it('theming', () => {
    const Button = styled.button`
      color: ${(props) => props.theme.main};
    `;

    const theme = { main: 'mediumseagreen' };

    toHaveStyleRule(
      <ThemeProvider theme={theme}>
        <Button />
      </ThemeProvider>,
      'color',
      'mediumseagreen'
    );
  });
});
