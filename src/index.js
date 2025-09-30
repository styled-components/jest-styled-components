const styleSheetSerializer = require("./styleSheetSerializer");
const init = require("./init");

init(global.beforeEach, expect);

module.exports = {
  styleSheetSerializer,
};
