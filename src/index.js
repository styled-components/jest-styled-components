const toMatchStyledComponentsSnapshot = require('./matchers/toMatchStyledComponentsSnapshot')
const toHaveStyle = require('./matchers/toHaveStyle')
const styleSheetSerializer = require('./serializers/styleSheetSerializer')

expect.addSnapshotSerializer(styleSheetSerializer)
expect.extend({ toMatchStyledComponentsSnapshot })
expect.extend({ toHaveStyle })
