const toHaveStyleRule = require('./toHaveStyleRule');
const styleSheetSerializer = require('./styleSheetSerializer');
const { resetStyleSheet } = require('./utils');

if (typeof beforeEach === 'function') {
  beforeEach(resetStyleSheet);
}

expect.addSnapshotSerializer(styleSheetSerializer);
expect.extend({ toHaveStyleRule });

module.exports = {
  styleSheetSerializer,
  resetStyleSheet,
};
