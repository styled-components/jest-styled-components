const toMatchStyledComponentsSnapshot = require('./matchers/toMatchStyledComponentsSnapshot')
const toHaveStyleRule = require('./matchers/toHaveStyle')
const styleSheetSerializer = require('./serializers/styleSheetSerializer')

expect.addSnapshotSerializer(styleSheetSerializer)
expect.extend({ toMatchStyledComponentsSnapshot, toHaveStyleRule })
