interface AsymmetricMatcher {
  $$typeof: Symbol;
  sample?: string | RegExp | object | Array<any> | Function;
}

type Value = string | RegExp | AsymmetricMatcher | undefined

interface Options {
  media?: string;
  modifier?: string;
  supports?: string;
}

declare namespace jest {

  interface Matchers<R> {
    toHaveStyleRule(property: string, value: Value, options?: Options): R;
  }
}
