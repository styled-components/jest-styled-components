const css = require('@adobe/css-tools');
const {
  AT_RULE_TYPES,
  getCSSForMatcher,
  getHashes,
  getKeyframeHashes,
} = require('./utils');

const cache = new WeakSet();
const getNodes = (node, nodes = []) => {
  if (!node || typeof node !== 'object') {
    return nodes;
  }
  nodes.push(node);
  if (node.children) {
    for (const child of Array.from(node.children)) getNodes(child, nodes);
  }
  return nodes;
};

const getClassNamesFromDOM = (node) => Array.from(node.classList);
const getClassNamesFromProps = (node) => {
  const classNameProp =
    node.props && (node.props.class || node.props.className);

  if (classNameProp) {
    return classNameProp.trim().split(/\s+/);
  }

  return [];
};

const getClassNames = (nodes) =>
  nodes.reduce((classNames, node) => {
    let newClassNames = null;

    if (global.Element && node instanceof global.Element) {
      newClassNames = getClassNamesFromDOM(node);
    } else {
      newClassNames = getClassNamesFromProps(node);
    }

    for (const className of newClassNames) classNames.add(className);

    return classNames;
  }, new Set());

const isStyledClass = (className) => /^\.?(\w+(-|_))?sc-/.test(className);

const filterClassNames = (classNames, hashSet) =>
  classNames.filter((className) => hashSet.has(className));
const filterUnreferencedClassNames = (classNames, hashSet) =>
  classNames.filter(
    (className) => isStyledClass(className) && !hashSet.has(className)
  );

const includesClassNames = (classNames, selectors) =>
  classNames.some((className) =>
    selectors.some((selector) => selector.includes(className))
  );

const includesUnknownClassNames = (classNames, selectors) =>
  !selectors
    .flatMap((selector) => selector.split(' '))
    .filter((chunk) => isStyledClass(chunk))
    .every((chunk) =>
      classNames.some((className) => chunk.includes(className))
    );

const filterRules = (classNames) => (rule) =>
  rule.type === 'rule' &&
  !includesUnknownClassNames(classNames, rule.selectors) &&
  includesClassNames(classNames, rule.selectors) &&
  rule.declarations.length;

const getAtRules = (ast, filter) =>
  ast.stylesheet.rules
    .filter((rule) => AT_RULE_TYPES.includes(rule.type))
    .map((atRule) => ({ ...atRule, rules: atRule.rules.filter(filter) }))
    .filter((atRule) => atRule.rules.length);

const getKeyframesRules = (ast, hashes) =>
  ast.stylesheet.rules.filter(
    (rule) => rule.type === 'keyframes' && hashes.has(rule.name)
  );

const getFilteredRulesAndStyle = (classNames, config = {}, hashes) => {
  const ast = getCSSForMatcher();
  const filter = filterRules(classNames);
  const rules = ast.stylesheet.rules.filter(filter);
  const atRules = getAtRules(ast, filter);
  const keyframesRules = hashes ? getKeyframesRules(ast, hashes) : [];
  const allRules = rules.concat(atRules).concat(keyframesRules);

  const filtered = {
    ...ast,
    stylesheet: { ...ast.stylesheet, rules: allRules },
  };

  return { rules, style: css.stringify(filtered, { indent: config.indent }) };
};

const getClassNamesFromSelectorsByRules = (classNames, rules, hashes) => {
  const selectors = rules.map((rule) => rule.selectors);
  const classNamesIncludingFromSelectors = new Set(classNames);

  for (const hash of hashes) {
    for (const selectorList of selectors) {
      if (selectorList[0].includes(hash)) {
        classNamesIncludingFromSelectors.add(hash);
        break;
      }
    }
  }

  return [...classNamesIncludingFromSelectors];
};

const replaceClassNames = (result, classNames, style, classNameFormatter) =>
  classNames
    .filter((className) => style.includes(className))
    .reduce(
      (acc, className, index) =>
        acc.replace(
          new RegExp(`\\b${className}\\b`, 'g'),
          classNameFormatter(index)
        ),
      result
    );

const stripUnreferencedClassNames = (result, classNames) =>
  classNames.reduce(
    (acc, className) => acc.replace(new RegExp(`${className}\\s?`, 'g'), ''),
    result
  );

const replaceKeyframeNames = (result, hashes) => {
  const keyframeHashes = getKeyframeHashes();
  if (!keyframeHashes.size) return result;

  let acc = result;
  let index = 0;
  for (const hash of keyframeHashes) {
    if (acc.includes(hash)) {
      acc = acc.replace(new RegExp(`\\b${hash}\\b`, 'g'), `k${index}`);
      index++;
    }
  }

  return acc;
};

const replaceHashes = (result, hashes) => {
  let acc = result;
  for (const className of hashes) {
    acc = acc.replace(
      new RegExp(`((class|className)="[^"]*?)${className}\\s?([^"]*")`, 'g'),
      '$1$3'
    );
  }
  return acc;
};

const serializerOptionDefaults = {
  addStyles: true,
  classNameFormatter: (index) => `c${index}`,
};
let serializerOptions = serializerOptionDefaults;

module.exports = {
  setStyleSheetSerializerOptions(options = {}) {
    serializerOptions = {
      ...serializerOptionDefaults,
      ...options,
    };
  },

  test(val) {
    return (
      val &&
      !cache.has(val) &&
      (val.$$typeof === Symbol.for('react.test.json') ||
        (global.Element && val instanceof global.Element))
    );
  },

  serialize(val, config, indentation, depth, refs, printer) {
    const nodes = getNodes(val);
    nodes.forEach(cache.add, cache);

    const hashes = getHashes();

    let classNames = [...getClassNames(nodes)];
    let unreferencedClassNames = classNames;

    classNames = filterClassNames(classNames, hashes);
    unreferencedClassNames = filterUnreferencedClassNames(
      unreferencedClassNames,
      hashes
    );

    const { rules, style } = getFilteredRulesAndStyle(
      classNames,
      config,
      hashes
    );
    const classNamesToReplace = getClassNamesFromSelectorsByRules(
      classNames,
      rules,
      hashes
    );
    const code = printer(val, config, indentation, depth, refs);

    let result = serializerOptions.addStyles
      ? `${style}${style ? '\n\n' : ''}${code}`
      : code;
    result = stripUnreferencedClassNames(result, unreferencedClassNames);
    result = replaceClassNames(
      result,
      classNamesToReplace,
      style,
      serializerOptions.classNameFormatter
    );
    result = replaceKeyframeNames(result, hashes);
    result = replaceHashes(result, hashes);
    nodes.forEach(cache.delete, cache);
    return result;
  },
};
