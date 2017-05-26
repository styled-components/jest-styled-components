declare namespace jest {
  interface Matchers {
    toMatchStyledComponentsSnapshot(): void;
    toHaveStyleRule(property: string, value: any): void;
  }
}
