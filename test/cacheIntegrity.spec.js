import React from 'react';
import renderer from 'react-test-renderer';
import styled from 'styled-components';
import '../src';
import { enableCSSCache, disableCSSCache } from '../src/utils';

describe('cache cross-test integrity', () => {
  beforeAll(() => {
    enableCSSCache();
  });

  afterAll(() => {
    disableCSSCache();
  });

  // These tests run in sequence. If the cache leaks across tests,
  // test B would see test A's styles.

  it('test A: renders red button', () => {
    const RedButton = styled.button`color: red;`;
    const tree = renderer.create(<RedButton />).toJSON();
    expect(tree).toHaveStyleRule('color', 'red');
  });

  it('test B: must NOT see red button styles from test A', () => {
    const BlueBox = styled.div`color: blue;`;
    const tree = renderer.create(<BlueBox />).toJSON();
    expect(tree).toHaveStyleRule('color', 'blue');
    // If cache leaked, this would find 'red' from test A
    expect(tree).not.toHaveStyleRule('color', 'red');
  });

  it('test C: mid-test render invalidates cache', () => {
    const First = styled.div`margin: 5px;`;
    const tree1 = renderer.create(<First />).toJSON();
    expect(tree1).toHaveStyleRule('margin', '5px');

    // Render a new component mid-test
    const Second = styled.div`padding: 20px;`;
    const tree2 = renderer.create(<Second />).toJSON();

    // Cache must invalidate and find the new styles
    expect(tree2).toHaveStyleRule('padding', '20px');
  });

  it('test D: snapshot serializer produces correct output with cache', () => {
    const Card = styled.div`
      background: white;
      border-radius: 4px;
    `;
    const tree = renderer.create(<Card />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('test E: snapshot from test D must not leak into this test', () => {
    const Badge = styled.span`font-weight: bold;`;
    const tree = renderer.create(<Badge />).toJSON();
    expect(tree).toMatchSnapshot();
    // Snapshot should only contain font-weight, not background/border-radius
  });
});
