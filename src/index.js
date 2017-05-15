const toMatchStyledComponentsSnapshot = require('./matchers/toMatchStyledComponentsSnapshot')
const toHaveStyleRule = require('./matchers/toHaveStyleRule')
const styleSheetSerializer = require('./serializers/styleSheetSerializer')

expect.addSnapshotSerializer(styleSheetSerializer)
expect.extend({ toMatchStyledComponentsSnapshot, toHaveStyleRule })
