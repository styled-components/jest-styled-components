import { beforeEach, expect } from "vitest";

const styleSheetSerializer = require("./src/styleSheetSerializer");
const init = require("./src/init");

init(beforeEach, expect);

module.exports = {
  styleSheetSerializer,
};
