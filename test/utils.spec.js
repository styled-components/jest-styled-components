import styled, { __PRIVATE__ } from 'styled-components'
import { render } from '@testing-library/react';
import React from 'react'
import { getHashes, resetStyleSheet } from '../src/utils';

const { mainSheet, masterSheet } = __PRIVATE__
const sheet = mainSheet || masterSheet;

it('extracts hashes', () => {
  sheet.names = new Map([
    ['sc-1', new Set(['a'])],
    ['sc-2', new Set(['b', 'c'])],
    ['sc-3', new Set(['d', 'e'])],
  ]);
  sheet.toString = function() {
    return `
      <style data-styled="active">
        .sc-1 {}
        data-styled.g1[id="sc-1"]{content:"sc-1,"}
        .a { color: red; }
      </style>
      <style data-styled="active">
        .sc-2 {}
        data-styled.g2[id="sc-2"]{content:"sc-2,"}
        .b { color: green; }
        .c { color: blue; }
      </style>
      <style data-styled="active">
        .sc-3 {}
        data-styled.g3[id="sc-3"]{content:"sc-3,"}
        .d { color: pink; }
        .e { color: indianred; }
      </style>
    `;
  };

  expect(getHashes()).toEqual(['sc-1', 'a', 'sc-2', 'b', 'c', 'sc-3', 'd', 'e']);
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
