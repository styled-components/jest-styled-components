const fs = require('fs');
const path = require('path');

// Jest resolves `styled-components` to the Node server build. On v5, and from
// v6.4.0 on, that build does not inject createGlobalStyle rules during a
// client render. The browser build injects them from an effect, which jsdom
// runs. One module instance keeps the matcher and the test on the same sheet.
const browserBuildPath = (resolved) => {
  if (resolved.includes(`${path.sep}styled-components.browser.`)) return null;

  const filename = path.basename(resolved);
  const browserName =
    filename === 'styled-components.cjs.js'
      ? 'styled-components.browser.cjs.js'
      : filename === 'styled-components.esm.js'
        ? 'styled-components.browser.esm.js'
        : null;
  if (!browserName) return null;

  const candidate = path.join(path.dirname(resolved), browserName);
  return fs.existsSync(candidate) ? candidate : null;
};

const installBrowserBuild = () => {
  let resolved;
  try {
    resolved = require.resolve('styled-components');
  } catch {
    return;
  }

  const browserPath = browserBuildPath(resolved);
  if (!browserPath) return;
  // A caller already holds the server module. Swapping now would split the sheet.
  if (require.cache[resolved]) return;

  const browser = require(browserPath);

  if (typeof jest !== 'undefined' && typeof jest.setMock === 'function') {
    jest.setMock('styled-components', browser);
    return;
  }

  if (require.cache[browserPath]) {
    require.cache[resolved] = require.cache[browserPath];
  }
};

installBrowserBuild();

module.exports = installBrowserBuild;
