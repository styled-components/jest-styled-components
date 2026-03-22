import React from 'react';
import renderer from 'react-test-renderer';
import styled from 'styled-components';
import { enableCSSCache, disableCSSCache, resetStyleSheet } from '../src/utils';
import '../src';

describe('CSS parse cache', () => {
  afterEach(() => {
    disableCSSCache();
  });

  it('is disabled by default — returns different references', () => {
    const Button = styled.button`color: red;`;
    renderer.create(<Button />);

    const { getCSSForMatcher } = require('../src/utils');
    const first = getCSSForMatcher();
    const second = getCSSForMatcher();

    expect(first).not.toBe(second);
  });

  it('returns same reference when enabled', () => {
    enableCSSCache();

    const Button = styled.button`color: red;`;
    renderer.create(<Button />);

    const { getCSSForMatcher } = require('../src/utils');
    const first = getCSSForMatcher();
    const second = getCSSForMatcher();
    const third = getCSSForMatcher();

    expect(first).toBe(second);
    expect(second).toBe(third);
  });

  it('invalidates when new component renders', () => {
    enableCSSCache();

    const Button = styled.button`color: red;`;
    renderer.create(<Button />);

    const { getCSSForMatcher } = require('../src/utils');
    const first = getCSSForMatcher();

    const Box = styled.div`padding: 10px;`;
    renderer.create(<Box />);
    const second = getCSSForMatcher();

    expect(first).not.toBe(second);
    const rules = second.stylesheet.rules.filter(r => r.type === 'rule');
    expect(rules.length).toBeGreaterThanOrEqual(2);
  });

  it('invalidates across tests via resetStyleSheet', () => {
    enableCSSCache();

    const A = styled.span`font-size: 12px;`;
    renderer.create(<A />);

    const { getCSSForMatcher } = require('../src/utils');
    const cached = getCSSForMatcher();

    resetStyleSheet();

    const B = styled.em`font-weight: bold;`;
    renderer.create(<B />);
    const after = getCSSForMatcher();

    expect(after).not.toBe(cached);
    const allCSS = JSON.stringify(after);
    expect(allCSS).toContain('font-weight');
    expect(allCSS).not.toContain('font-size');
  });

  it('does not return stale data when stylesheet grows mid-test', () => {
    enableCSSCache();

    const First = styled.div`margin: 5px;`;
    renderer.create(<First />);

    const { getCSSForMatcher } = require('../src/utils');
    const ast1 = getCSSForMatcher();

    const Second = styled.div`border: 1px solid black;`;
    renderer.create(<Second />);
    const ast2 = getCSSForMatcher();

    const css1 = JSON.stringify(ast1);
    const css2 = JSON.stringify(ast2);

    expect(css1).toContain('margin');
    expect(css1).not.toContain('border');
    expect(css2).toContain('margin');
    expect(css2).toContain('border');
  });

  it('matcher assertions work correctly with cache enabled', () => {
    enableCSSCache();

    const Card = styled.div`
      color: red;
      padding: 8px;
      margin: 4px;
      background: white;
      border: none;
      font-size: 14px;
      line-height: 1.5;
      display: flex;
    `;
    const tree = renderer.create(<Card />).toJSON();

    expect(tree).toHaveStyleRule('color', 'red');
    expect(tree).toHaveStyleRule('padding', '8px');
    expect(tree).toHaveStyleRule('margin', '4px');
    expect(tree).toHaveStyleRule('background', 'white');
    expect(tree).toHaveStyleRule('border', 'none');
    expect(tree).toHaveStyleRule('font-size', '14px');
    expect(tree).toHaveStyleRule('line-height', '1.5');
    expect(tree).toHaveStyleRule('display', 'flex');
  });

  it('handles empty stylesheet after reset', () => {
    enableCSSCache();

    const X = styled.div`opacity: 0.5;`;
    renderer.create(<X />);

    const { getCSSForMatcher } = require('../src/utils');
    getCSSForMatcher();

    resetStyleSheet();

    const ast = getCSSForMatcher();
    const rules = ast.stylesheet.rules.filter(r => r.type === 'rule');
    expect(rules.length).toBe(0);
  });

  it('disableCSSCache clears cached state', () => {
    enableCSSCache();

    const Y = styled.div`z-index: 1;`;
    renderer.create(<Y />);

    const { getCSSForMatcher } = require('../src/utils');
    const cached = getCSSForMatcher();

    disableCSSCache();

    const uncached = getCSSForMatcher();
    expect(uncached).not.toBe(cached);
  });
});
