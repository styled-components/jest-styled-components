const toHaveStyleRule = require('./toHaveStyleRule')
const styleSheetSerializer = require('./styleSheetSerializer')
const styleSheet = require('styled-components/lib/models/StyleSheet')
const { isOverV2, isServer } = require('./utils')

if (isOverV2()) {
  styleSheet.default.reset(isServer())
}

expect.addSnapshotSerializer(styleSheetSerializer)
expect.extend({ toHaveStyleRule })
