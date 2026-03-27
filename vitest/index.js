import { createRequire } from 'node:module';
import { beforeEach, expect } from 'vitest';

const require = createRequire(import.meta.url);
const toHaveStyleRule = require('../src/toHaveStyleRule');
const styleSheetSerializer = require('../src/styleSheetSerializer');
const {
  resetStyleSheet,
  enableCSSCache,
  disableCSSCache,
} = require('../src/utils');

beforeEach(resetStyleSheet);
expect.addSnapshotSerializer(styleSheetSerializer);
expect.extend({ toHaveStyleRule });

const setStyleRuleOptions = toHaveStyleRule.setOptions;

export {
  disableCSSCache,
  enableCSSCache,
  resetStyleSheet,
  setStyleRuleOptions,
  styleSheetSerializer,
};
