const toHaveStyleRule = require('./toHaveStyleRule');
const styleSheetSerializer = require('./styleSheetSerializer');
const { resetStyleSheet, enableCSSCache, disableCSSCache } = require('./utils');

if (typeof beforeEach === 'function') {
  beforeEach(resetStyleSheet);
}

if (typeof expect !== 'undefined') {
  expect.addSnapshotSerializer(styleSheetSerializer);
  expect.extend({ toHaveStyleRule });
}

module.exports = {
  styleSheetSerializer,
  resetStyleSheet,
  enableCSSCache,
  disableCSSCache,
};
