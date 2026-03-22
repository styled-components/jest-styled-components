const {
  AT_RULE_TYPES,
  getCSSForMatcher,
  matcherTest,
  buildReturnMessage,
} = require('./utils');

const shouldDive = (node) =>
  typeof node.dive === 'function' && typeof node.type() !== 'string';

const isTagWithClassName = (node) =>
  node.exists() && node.prop('className') && typeof node.type() === 'string';

const isStyledClass = (className) => /(_|-)+sc-.+|^sc-/.test(className);

const hasClassName = (node) =>
  node.length > 0 &&
  typeof node.props === 'function' &&
  node.prop('className') &&
  isStyledClass(node.prop('className'));

const getClassNames = (received) => {
  let className;

  if (received) {
    if (received.$$typeof === Symbol.for('react.test.json')) {
      className = received.props.className || received.props.class;
    } else if (hasClassName(received)) {
      className = received.prop('className');
    } else if (typeof received.exists === 'function' && received.exists()) {
      const tree = shouldDive(received) ? received.dive() : received;
      const components = tree.findWhere(isTagWithClassName);
      if (components.length) {
        className = components.first().prop('className');
      }
    } else if (global.Element && received instanceof global.Element) {
      className = Array.from(received.classList).join(' ');
    }
  }

  return className ? className.split(/\s/) : [];
};

const hasAtRule = (options) =>
  Object.keys(options).some((option) => AT_RULE_TYPES.includes(option));

const normalizeColonSpace = (s) => s.replace(/:\s/g, ':');

const getAtRules = (ast, options) => {
  const atRuleOptions = Object.keys(options).filter((opt) =>
    AT_RULE_TYPES.includes(opt)
  );

  const collectLeafRules = (rules, remainingOptions, acc) => {
    if (remainingOptions.length === 0) {
      for (const r of rules) acc.push(r);
      return;
    }

    for (const rule of rules) {
      const optionIndex = remainingOptions.findIndex(
        (opt) =>
          rule.type === opt &&
          normalizeColonSpace(rule[opt]) === normalizeColonSpace(options[opt])
      );

      if (optionIndex !== -1) {
        const remaining = remainingOptions.filter((_, i) => i !== optionIndex);
        collectLeafRules(rule.rules || [], remaining, acc);
      } else if (rule.rules) {
        collectLeafRules(rule.rules, remainingOptions, acc);
      }
    }
  };

  const results = [];
  collectLeafRules(ast.stylesheet.rules, atRuleOptions, results);
  return results;
};

/** stylis v4 strips spaces around CSS combinators (> ~ +), normalize both sides for comparison */
const normalizeCombinatorSpaces = (input) =>
  input.replace(/ *([>~+]) */g, '$1');

const normalizeQuotations = (input) => input.replace(/['"]/g, '"');

const getModifiedClassName = (className, staticClassName, modifier = '') => {
  const classNameSelector = `.${className}`;
  let prefix = '';

  modifier = modifier.trim();
  if (modifier.includes('&')) {
    modifier = modifier
      // & combined with other selectors and not a precedence boost should be replaced with the static className, but the first instance should be the dynamic className
      .replace(/(&[^&]+?)&/g, `$1.${staticClassName}`)
      .replace(/&/g, classNameSelector);
  } else {
    prefix += classNameSelector;
  }
  const first = modifier[0];
  if (first !== ':' && first !== '[') {
    prefix += ' ';
  }

  return `${prefix}${modifier}`.trim();
};

const hasClassNames = (classNames, selectors, options) => {
  const staticClassNames = classNames.filter((x) => isStyledClass(x));
  const normalizedSelectors = selectors.map(normalizeCombinatorSpaces);

  return classNames.some((className) =>
    staticClassNames.some((staticClassName) =>
      normalizedSelectors.includes(
        normalizeCombinatorSpaces(
          normalizeQuotations(
            getModifiedClassName(className, staticClassName, options.modifier)
          )
        )
      )
    )
  );
};

const getBaseRules = (ast, options) =>
  hasAtRule(options) ? getAtRules(ast, options) : ast.stylesheet.rules;

const getRules = (ast, classNames, options) =>
  getBaseRules(ast, options)
    .filter((rule) => rule.type === 'rule')
    .map((rule) => ({
      ...rule,
      selectors: Array.isArray(rule.selectors)
        ? rule.selectors.map(normalizeQuotations)
        : rule.selectors,
    }))
    .filter((rule) => hasClassNames(classNames, rule.selectors, options));

const getRulesBySelector = (ast, selector, options) => {
  const normalizedSelector = normalizeQuotations(selector);

  return getBaseRules(ast, options).filter(
    (rule) =>
      rule.type === 'rule' &&
      rule.selectors.some((s) => normalizeQuotations(s) === normalizedSelector)
  );
};

const handleMissingRules = (options) => ({
  pass: false,
  message: () =>
    `No style rules found on passed Component${
      Object.keys(options).length
        ? ` using options:\n${JSON.stringify(options)}`
        : ''
    }`,
});

const getDeclaration = (rule, property) =>
  rule.declarations
    .filter(
      (declaration) =>
        declaration.type === 'declaration' && declaration.property === property
    )
    .pop();

const getDeclarations = (rules, property) =>
  rules.map((rule) => getDeclaration(rule, property)).filter(Boolean);

const normalizeOptions = (options) =>
  options.modifier
    ? Object.assign({}, options, {
        modifier: Array.isArray(options.modifier)
          ? options.modifier.join('')
          : options.modifier,
      })
    : options;

function toHaveStyleRule(component, property, expected, options = {}) {
  const ast = getCSSForMatcher();
  const normalizedOptions = normalizeOptions(options);
  let rules;

  if (normalizedOptions.selector) {
    rules = getRulesBySelector(
      ast,
      normalizedOptions.selector,
      normalizedOptions
    );
  } else {
    const classNames = getClassNames(component);
    rules = getRules(ast, classNames, normalizedOptions);
  }

  if (!rules.length) {
    return handleMissingRules(normalizedOptions);
  }

  const declarations = getDeclarations(rules, property);
  const declaration = declarations.pop() || {};
  const received = declaration.value;
  const pass = matcherTest(received, expected, this.isNot);

  return {
    pass,
    message: buildReturnMessage(this.utils, pass, property, received, expected),
  };
}

module.exports = toHaveStyleRule;
