const { getHashes } = require('../src/utils');

jest.mock('styled-components', () => ({
  ServerStyleSheet: true,
  __PRIVATE__: {
    masterSheet: {
      names: new Map([['sc-1', new Set(['a'])], ['sc-2', new Set(['b', 'c'])], ['sc-3', new Set(['d', 'e'])]]),
      toString() {
        return `
            <style data-styled="active">
              .sc-1 {}
              data-styled.g1[id="sc-1"]{content:"sc-1,"}
              .a { color: red; }
            </style>
            <style data-styled="active">
              .sc-2 {}
              data-styled.g2[id="sc-2"]{content:"sc-2,"}
              .b { color: green; }
              .c { color: blue; }
            </style>
            <style data-styled="active">
              .sc-3 {}
              data-styled.g3[id="sc-3"]{content:"sc-3,"}
              .d { color: pink; }
              .e { color: indianred; }
            </style>
          `;
      },
    },
  },
}));

it('extracts hashes', () => {
  expect(getHashes()).toEqual(['sc-1', 'a', 'sc-2', 'b', 'c', 'sc-3', 'd', 'e']);
});
