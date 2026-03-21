const { expect, beforeEach } = require('vitest');
const toHaveStyleRule = require('../src/toHaveStyleRule');
const styleSheetSerializer = require('../src/styleSheetSerializer');
const { resetStyleSheet } = require('../src/utils');

beforeEach(resetStyleSheet);
expect.addSnapshotSerializer(styleSheetSerializer);
expect.extend({ toHaveStyleRule });

module.exports = {
  styleSheetSerializer,
  resetStyleSheet,
};
