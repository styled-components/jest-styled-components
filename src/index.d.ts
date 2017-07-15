declare namespace jest {
  interface Matchers<R> {
    toHaveStyleRule(property: string, value: string): R;
  }
}
