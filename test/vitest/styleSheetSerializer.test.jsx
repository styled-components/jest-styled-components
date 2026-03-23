import { describe, it, expect } from 'vitest';
import React from 'react';
import renderer from 'react-test-renderer';
import styled from 'styled-components';
import 'jest-styled-components/vitest';

describe('styleSheetSerializer (vitest, no globals)', () => {
  it('inlines styles into snapshots', () => {
    const Button = styled.button`
      color: red;
    `;

    expect(renderer.create(<Button />).toJSON()).toMatchSnapshot();
  });

  it('replaces class names with deterministic placeholders', () => {
    const Wrapper = styled.section`
      padding: 4em;
      background: papayawhip;
    `;

    const Title = styled.h1`
      font-size: 1.5em;
      color: palevioletred;
    `;

    expect(
      renderer
        .create(
          <Wrapper>
            <Title>Hello</Title>
          </Wrapper>
        )
        .toJSON()
    ).toMatchSnapshot();
  });

  it('handles multiple components', () => {
    const Button = styled.button`
      color: ${(props) => (props.primary ? 'white' : 'palevioletred')};
      background: ${(props) => (props.primary ? 'palevioletred' : 'white')};
    `;

    expect(
      renderer
        .create(
          <div>
            <Button />
            <Button primary />
          </div>
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
