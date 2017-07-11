declare namespace jest {
  interface Matchers<R> {
    toMatchStyledComponentsSnapshot(): R;
    toHaveStyleRule(property: string, value: any): R;
  }
}
