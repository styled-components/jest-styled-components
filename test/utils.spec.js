import styled, { __PRIVATE__ } from 'styled-components'
import { render } from '@testing-library/react';
import React from 'react'
import { getHashes, getCSS, resetStyleSheet } from '../src/utils';

const { mainSheet, masterSheet } = __PRIVATE__
const sheet = mainSheet || masterSheet;

it('extracts hashes', () => {
  sheet.names = new Map([
    ['sc-1', new Set(['a'])],
    ['sc-2', new Set(['b', 'c'])],
    ['sc-3', new Set(['d', 'e'])],
  ]);

  expect(getHashes()).toEqual(new Set(['sc-1', 'a', 'sc-2', 'b', 'c', 'sc-3', 'd', 'e']));
});

describe('getCSS', () => {
  beforeEach(resetStyleSheet);

  it('throws a descriptive error when CSS is invalid', () => {
    sheet.registerName('sc-bad', 'bad123');
    sheet.insertRules('sc-bad', 'bad123', ['.bad123{color:red;) no-repeat}']);

    expect(() => getCSS()).toThrow(/jest-styled-components: Failed to parse component CSS/);
  });

  it('includes the reason, caret, and offending rule in the error', () => {
    sheet.registerName('sc-bad', 'bad123');
    sheet.insertRules('sc-bad', 'bad123', ['.bad123{color:red;) no-repeat}']);

    try {
      getCSS();
      throw new Error('should have thrown');
    } catch (e) {
      expect(e.message).toMatch(/missing '\}'/);
      expect(e.message).toContain('bad123');
      expect(e.message).toContain('^');
    }
  });

  it('splits rules onto separate lines and shows context', () => {
    for (let i = 0; i < 4; i++) {
      sheet.registerName(`sc-${i}`, `cls${i}`);
      sheet.insertRules(`sc-${i}`, `cls${i}`, [`.cls${i}{color:var(--c${i})}`]);
    }
    sheet.registerName('sc-bad', 'bad1');
    sheet.insertRules('sc-bad', 'bad1', ['.bad1{color:red;) oops}']);

    try {
      getCSS();
      throw new Error('should have thrown');
    } catch (e) {
      // The broken rule is marked with >
      expect(e.message).toMatch(/>\s+\d+ \| \.bad1/);
      // No /*!sc*/ markers in the display output
      expect(e.message).not.toContain('/*!sc*/');
      // Rules are split — multiple numbered lines visible
      expect(e.message).toMatch(/\d+ \| \.cls/);
    }
  });
});

it('resets style sheets', () => {
  const Component = styled.div`
    background-color: orange;
  `

  render(<Component />)

  expect(
    document.querySelectorAll('style[data-styled-version]').length,
  ).not.toBe(0)
  expect(sheet.names.size).not.toBe(0)

  resetStyleSheet()

  expect(
    document.querySelectorAll('style[data-styled-version]').length,
  ).toBe(0)
  expect(sheet.names.size).toBe(0)
})
