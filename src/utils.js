const css = require('css');
const { ServerStyleSheet, __PRIVATE__ } = require('styled-components');

if (!__PRIVATE__) {
  throw new Error('Could neither find styled-components secret internals');
}

const { mainSheet, masterSheet } = __PRIVATE__;

const sheet = mainSheet || masterSheet;
const isServer = () => typeof document === 'undefined';

const resetStyleSheet = () => {
  sheet.names = new Map();
  sheet.clearTag();
};

const getHTML = () => (isServer() ? new ServerStyleSheet().getStyleTags() : sheet.toString());

const extract = (regex) => {
  let style = '';
  let matches;

  while ((matches = regex.exec(getHTML())) !== null) {
    style += `${matches[1]} `;
  }

  return style.trim();
};

const getStyle = () => extract(/^(?!data-styled\.g\d+.*?\n)(.*)?\n/gm);
const getCSS = () => css.parse(getStyle());

const getHashes = () => {
  const hashes = new Set();

  for (const [mainHash, childHashSet] of sheet.names) {
    hashes.add(mainHash);

    for (const childHash of childHashSet) hashes.add(childHash);
  }

  return Array.from(hashes);
};

const buildReturnMessage = (utils, pass, property, received, expected) => () =>
  `${utils.printReceived(
    !received && !pass ? `Property '${property}' not found in style rules` : `Value mismatch for property '${property}'`
  )}\n\n` +
  'Expected\n' +
  `  ${utils.printExpected(`${property}: ${expected}`)}\n` +
  'Received:\n' +
  `  ${utils.printReceived(`${property}: ${received}`)}`;

const matcherTest = (received, expected) => {
  try {
    const matcher = expected instanceof RegExp ? expect.stringMatching(expected) : expected;

    expect(received).toEqual(matcher);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  resetStyleSheet,
  getCSS,
  getHashes,
  buildReturnMessage,
  matcherTest,
};
