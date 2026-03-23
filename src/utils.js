const css = require('@adobe/css-tools');
const { __PRIVATE__ } = require('styled-components');

if (!__PRIVATE__) {
  throw new Error(
    'Could not find styled-components internals (__PRIVATE__). Ensure styled-components v5+ is installed.'
  );
}

const { mainSheet, masterSheet } = __PRIVATE__;

const sheet = mainSheet || masterSheet;

const resetStyleSheet = () => {
  if (typeof document !== 'undefined') {
    const scStyles = document.querySelectorAll('style[data-styled-version]');
    for (const item of scStyles) {
      item.parentElement.removeChild(item);
    }
  }

  sheet.gs = {};
  sheet.names = new Map();
  sheet.clearTag();
  invalidateCSSCache();
};

const getHTML = () => sheet.toString();

const extract = (html, regex) => {
  let style = '';

  for (
    let matches = regex.exec(html);
    matches !== null;
    matches = regex.exec(html)
  ) {
    style += `${matches[1]} `;
  }

  return style.trim();
};

const getStyle = (html) =>
  extract(html || getHTML(), /^(?!data-styled\.g\d+.*?\n)(.*)?\n/gm);

const CONTEXT_LINES = 4;
const SC_COMMENT_RE = /\/\*!sc\*\//g;

/**
 * Split raw CSS into one-rule-per-line for readable error display.
 * Maps the original line:column back to the split output.
 */
const splitCSSRules = (cssText, origLine, origColumn) => {
  const rawLines = cssText.split('\n');
  const displayLines = [];
  let errorDisplayLine = -1;
  let errorDisplayColumn = origColumn;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const isErrorLine = i + 1 === origLine;

    // Find /*!sc*/ positions to split into chunks
    SC_COMMENT_RE.lastIndex = 0;
    const separators = [];
    for (
      let m = SC_COMMENT_RE.exec(raw);
      m !== null;
      m = SC_COMMENT_RE.exec(raw)
    ) {
      separators.push({ start: m.index, end: m.index + m[0].length });
    }

    // No styled-components comments — keep line as-is
    if (separators.length === 0) {
      if (raw.length > 0) {
        displayLines.push(raw);
        if (isErrorLine) {
          errorDisplayLine = displayLines.length;
          errorDisplayColumn = origColumn;
        }
      }
      continue;
    }

    // Extract chunks between separators
    let pos = 0;
    for (const sep of separators) {
      const chunk = raw.slice(pos, sep.start).trim();
      if (chunk.length > 0) {
        displayLines.push(chunk);
        if (isErrorLine && errorDisplayLine === -1 && origColumn <= sep.start) {
          errorDisplayLine = displayLines.length;
          errorDisplayColumn = origColumn - pos;
        }
      }
      // Advance past separator and any trailing whitespace
      pos = sep.end;
      while (pos < raw.length && raw[pos] === ' ') pos++;
    }

    // Trailing content after last separator
    const tail = raw.slice(pos).trim();
    if (tail.length > 0) {
      displayLines.push(tail);
      if (isErrorLine && errorDisplayLine === -1) {
        errorDisplayLine = displayLines.length;
        errorDisplayColumn = origColumn - pos;
      }
    }

    if (isErrorLine && errorDisplayLine === -1) {
      errorDisplayLine = displayLines.length;
      errorDisplayColumn = 1;
    }
  }

  return {
    lines: displayLines,
    errorLine: errorDisplayLine,
    errorColumn: errorDisplayColumn,
  };
};

const buildCSSParseError = (originalError, cssText) => {
  const reason = originalError.reason || originalError.message;
  const { lines, errorLine, errorColumn } = splitCSSRules(
    cssText,
    originalError.line || 1,
    originalError.column || 1
  );

  const start = Math.max(0, errorLine - CONTEXT_LINES - 1);
  const end = Math.min(lines.length, errorLine + 1);
  const pad = String(end).length;

  const context = lines
    .slice(start, end)
    .map((content, i) => {
      const lineNum = start + i + 1;
      const isError = lineNum === errorLine;
      const marker = isError ? '>' : ' ';
      const prefix = `  ${marker} ${String(lineNum).padStart(pad)} | `;
      const line = `${prefix}${content}`;
      if (isError && errorColumn > 0) {
        return `${line}\n  ${' '.repeat(pad + 3)}| ${' '.repeat(errorColumn - 1)}^`;
      }
      return line;
    })
    .join('\n');

  const error = new Error(
    `jest-styled-components: Failed to parse component CSS.\n\n` +
      `  ${reason}\n\n` +
      `${context}\n\n` +
      `  This usually means a styled-component is interpolating a non-string\n` +
      `  value into its CSS template.`
  );
  return error;
};

const safeParse = (cssText) => {
  try {
    return css.parse(cssText);
  } catch (e) {
    throw buildCSSParseError(e, cssText);
  }
};

const getCSS = () => safeParse(getStyle());

let _cssCache = false;
let _cachedAST = null;
let _lastSheetOutput = null;

const invalidateCSSCache = () => {
  _cachedAST = null;
  _lastSheetOutput = null;
};

const enableCSSCache = () => {
  _cssCache = true;
};
const disableCSSCache = () => {
  _cssCache = false;
  invalidateCSSCache();
};

const getCSSForMatcher = () => {
  if (!_cssCache) return getCSS();
  const html = getHTML();
  if (html === _lastSheetOutput) return _cachedAST;
  try {
    const ast = safeParse(getStyle(html));
    _lastSheetOutput = html;
    _cachedAST = ast;
    return _cachedAST;
  } catch (error) {
    invalidateCSSCache();
    throw error;
  }
};

const getHashes = () => {
  const hashes = new Set();

  for (const [mainHash, childHashSet] of sheet.names) {
    hashes.add(mainHash);

    for (const childHash of childHashSet) hashes.add(childHash);
  }

  return hashes;
};

const buildReturnMessage = (utils, pass, property, received, expected) => () =>
  `${utils.printReceived(
    received === undefined && !pass
      ? `Property '${property}' not found in style rules`
      : pass
        ? 'Expected property not to match'
        : `Value mismatch for property '${property}'`
  )}\n\n` +
  'Expected\n' +
  `  ${utils.printExpected(`${property}: ${expected}`)}\n` +
  'Received:\n' +
  `  ${utils.printReceived(`${property}: ${received}`)}`;

/** Normalize whitespace differences that stylis v4 introduces in CSS values.
 *  Skips content inside quotes to avoid mangling e.g. content: "a / b". */
const normalizeUnquoted = (text) =>
  text
    .replace(/,\s+/g, ',') // stylis strips spaces after commas in function args
    .replace(/\s*\/\s*/g, '/') // stylis strips spaces around shorthand separators (e.g. font, container)
    .replace(/\s+!important/g, '!important'); // stylis collapses the space before !important

const normalizeValueSpacing = (value) => {
  if (typeof value !== 'string') return value;
  // Fast path: no quotes means nothing to protect
  if (!value.includes('"') && !value.includes("'"))
    return normalizeUnquoted(value);
  // Split around quoted segments (respecting escaped quotes), only normalize unquoted parts
  return value.replace(/(["'])(?:\\.|(?!\1).)*\1|[^"']+/g, (match) =>
    match[0] === '"' || match[0] === "'" ? match : normalizeUnquoted(match)
  );
};

const matcherTest = (received, expected, isNot) => {
  // when negating, assert on existence of the style, rather than the value
  if (isNot && expected === undefined) {
    return received !== undefined;
  }

  // Normalize whitespace so user-written values match stylis output
  const normalizedReceived = normalizeValueSpacing(received);

  if (expected instanceof RegExp) {
    return expected.test(normalizedReceived);
  }

  // Support asymmetric matchers (e.g. expect.stringContaining()) from any framework
  if (
    expected != null &&
    typeof expected === 'object' &&
    typeof expected.asymmetricMatch === 'function'
  ) {
    return expected.asymmetricMatch(normalizedReceived);
  }

  return normalizedReceived === normalizeValueSpacing(expected);
};

const AT_RULE_TYPES = ['media', 'supports', 'container', 'layer'];

module.exports = {
  AT_RULE_TYPES,
  resetStyleSheet,
  enableCSSCache,
  disableCSSCache,
  getCSS,
  getCSSForMatcher,
  getHashes,
  buildReturnMessage,
  matcherTest,
};
