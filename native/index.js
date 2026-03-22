const toHaveStyleRule = require('../src/native/toHaveStyleRule');

if (typeof expect !== 'undefined') {
  expect.extend({ toHaveStyleRule });
}
