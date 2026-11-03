const toHaveStyleRule = require('./toHaveStyleRule');
const styleSheetSerializer = require('./styleSheetSerializer');
const { resetStyleSheet, enableCSSCache, disableCSSCache } = require('./utils');

if (typeof beforeEach === 'function') {
  beforeEach(resetStyleSheet);
}

if (typeof expect !== 'undefined') {
  try {
    expect.addSnapshotSerializer(styleSheetSerializer);
  } catch (error) {
    // Bun through 1.4.4 exposes this method but throws "Not implemented". Remove when those releases are out of support.
    if (typeof Bun === 'undefined') throw error;
  }

  expect.extend({ toHaveStyleRule });
}

module.exports = {
  styleSheetSerializer,
  resetStyleSheet,
  enableCSSCache,
  disableCSSCache,
  setStyleRuleOptions: toHaveStyleRule.setOptions,
};
