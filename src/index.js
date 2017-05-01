const toMatchStyledComponentsSnapshot = require('./matchers/toMatchStyledComponentsSnapshot')
const styleSheetSerializer = require('./serializers/styleSheetSerializer')

expect.addSnapshotSerializer(styleSheetSerializer)
expect.extend({ toMatchStyledComponentsSnapshot })
