import { createRequire } from 'node:module';
import * as styledComponents from 'styled-components';
import { beforeEach, expect } from 'vitest';

const require = createRequire(import.meta.url);
const toHaveStyleRule = require('../src/toHaveStyleRule');
const styleSheetSerializer = require('../src/styleSheetSerializer');
const {
  bindStyleSheet,
  resetStyleSheet,
  enableCSSCache,
  disableCSSCache,
} = require('../src/utils');

// The Vite import above follows the project's alias. The CJS matcher would
// otherwise read a second copy resolved by Node.
bindStyleSheet(styledComponents);

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
