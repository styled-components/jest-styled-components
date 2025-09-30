const toHaveStyleRule = require('./toHaveStyleRule');
const styleSheetSerializer = require('./styleSheetSerializer');
const { resetStyleSheet } = require('./utils');

function init(beforeEach, expect) {
    beforeEach(resetStyleSheet);

    expect.addSnapshotSerializer(styleSheetSerializer);
    expect.extend({ toHaveStyleRule });

}

module.exports = init