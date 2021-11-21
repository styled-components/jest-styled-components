# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [7.0.6](https://github.com/styled-components/jest-styled-components/compare/v7.0.5...v7.0.6) - 2021-11-09

- Fix false negative detection of some media queries by simplifying media query regex for stripping spaces (#379)
- Improve test and memory utilization by removing sc style nodes on cleanup (#382)
- Add snapshot options to customize what CSS is included in jest snapshots (#375)
- Fix type error when using css ttl with "modifier" option (#367)
- Add example of how to handle override styles to README.md (#372)

## [7.0.5](https://github.com/styled-components/jest-styled-components/compare/v7.0.4...v7.0.5) - 2021-07-09

- Add setStyleSheetSerializerOptions to control snapshot output
- Strip styled components referenced in css by not used in the render (#351)
- Set minimum node engine version to v12 (current minimum maintenance version)

## [7.0.4](https://github.com/styled-components/jest-styled-components/compare/v7.0.3...v7.0.4) - 2021-04-18

- support styled-components v6

## [7.0.3](https://github.com/styled-components/jest-styled-components/compare/v7.0.2...v7.0.3) - 2020-08-19

- Strip static class names from jest snapshot results (#320) thanks @blnoonan
- Fix get styled className from children components (#313) thanks @vxcamiloxv

## [7.0.2](https://github.com/styled-components/jest-styled-components/compare/v7.0.1...v7.0.2) - 2020-04-09

Fix toHaveStyleRule support classes with displayName prefix (#302) thanks @vxcamiloxv

## [7.0.1](https://github.com/styled-components/jest-styled-components/compare/v7.0.0...v7.0.1) - 2020-04-07

- Update Matchers interface (#269) thanks @tobilen

- Extend global namespace with jest matcher (#308) thanks @tobilen

- support shallow rendering when nesting styled components (#306) (#309) thanks @functionalDev

- Remove object spread to continue Node LTS 10/12 support (#304) thanks @vxcamiloxv

## [7.0.0](https://github.com/styled-components/jest-styled-components/compare/v6.3.1...v7.0.0) - 2020-01-13

- styled-components v5 support, drops support for s-c versions below v5
- ship `stylesheetSerializer` as a named export

## [6.3.1](https://github.com/styled-components/jest-styled-components/compare/v6.3.0...v6.3.1) - 2018-11-11

### Fixed

- [toHaveStyleRule] Fix `.not undefinded` edge-case introduced in [#206](https://github.com/styled-components/jest-styled-components/pull/206) (see [#210](https://github.com/styled-components/jest-styled-components/pull/210)).

## [6.3.0](https://github.com/styled-components/jest-styled-components/compare/v6.2.2...v6.3.0) - 2018-11-10

### Added

- [toHaveStyleRule] Ability to avoid passing the expected value and use the `.not` modifier (see [#206](https://github.com/styled-components/jest-styled-components/pull/206)).

## [6.2.2](https://github.com/styled-components/jest-styled-components/compare/v6.2.1...v6.2.2) - 2018-10-21

### Fixed

- Avoid using object spread to make this package compatible with Node <8.6 (see [#196](https://github.com/styled-components/jest-styled-components/pull/196)).

## [6.2.1](https://github.com/styled-components/jest-styled-components/compare/v6.2.0...v6.2.1) - 2018-09-22

### Fixed

- [toHaveStyleRule] Do not fail when components have empty string as children (see [#189](https://github.com/styled-components/jest-styled-components/pull/189)).

## [6.2.0](https://github.com/styled-components/jest-styled-components/compare/v6.1.1...v6.2.0) - 2018-09-08

### Added

- Ability to export serializer (see [#173](https://github.com/styled-components/jest-styled-components/pull/173)).
- Support for v4 data attribute (see [#181](https://github.com/styled-components/jest-styled-components/pull/181)).

### Fixed

- [toHaveStyleRule] Fix media regex to allow dots (see [#182](https://github.com/styled-components/jest-styled-components/pull/182)).

## [6.1.1](https://github.com/styled-components/jest-styled-components/compare/v6.1.0...v6.1.1) - 2018-08-22

### Fixed

- [toHaveStyleRule] Fix regression with nested components.
- [toHaveStyleRule] Avoid throwing on non existing Enzyme components.

## [6.1.0](https://github.com/styled-components/jest-styled-components/compare/v6.0.1...v6.1.0) - 2018-08-19

### Added

- Support [react-testing-library](https://github.com/kentcdodds/react-testing-library).

## [6.0.1](https://github.com/styled-components/jest-styled-components/compare/v6.0.0...v6.0.1) - 2018-08-11

### Fixed

- Fix `AsymmetricMatcher` TS definition.

## [6.0.0](https://github.com/styled-components/jest-styled-components/compare/v5.0.1...v6.0.0) - 2018-08-11

### Changed

- [toHaveStyleRule] Added support for Jest asymmetric matchers and more (see [#148](https://github.com/styled-components/jest-styled-components/pull/148)).

### Fixed

- [toHaveStyleRule] Support `&&` (see [#126](https://github.com/styled-components/jest-styled-components/pull/126)).
- [toHaveStyleRule] Nested component classNames are serialized too(see [#162](https://github.com/styled-components/jest-styled-components/pull/162)).

## [5.0.1](https://github.com/styled-components/jest-styled-components/compare/v5.0.0...v5.0.1) - 2018-04-01

### Fixed

- [toHaveStyleRule] Allow spaces or no spaces in media queries (see
  [#128](https://github.com/styled-components/jest-styled-components/pull/128)).

### Changed

- Improve README (see
  [#127](https://github.com/styled-components/jest-styled-components/pull/127)
  [#131](https://github.com/styled-components/jest-styled-components/pull/131)
  [#132](https://github.com/styled-components/jest-styled-components/pull/132)).

## [5.0.0](https://github.com/styled-components/jest-styled-components/compare/v4.10.0...v5.0.0) - 2018-02-24

### Changed

- [toHaveStyleRule] Improve support for complex modifiers.

### Removed

- Drop support for Styled Components v1.

## [4.10.0](https://github.com/styled-components/jest-styled-components/compare/v4.9.0...v4.10.0) - 2018-01-14

### Added

- [toHaveStyleRule] Support Preact.

## [4.9.0](https://github.com/styled-components/jest-styled-components/compare/v4.8.0...v4.9.0) - 2017-10-22

### Changed

- [toHaveStyleRule (Native)] Full rewrite to support Styled Components v2.
- Update dependencies.
- Improve README.

### Fixed

- [toHaveStyleRule (React)] Support styled components wrapped with `styled`.

## [4.8.0](https://github.com/styled-components/jest-styled-components/compare/v4.7.1...v4.8.0) - 2017-10-21

### Changed

- [toMatchSnapshot] Support Preact.

## [4.7.1](https://github.com/styled-components/jest-styled-components/compare/v4.7.0...v4.7.1) - 2017-10-18

### Fixed

- [toMatchSnapshot] Add the optional `options` parameter to the matcher type definition.

## [4.7.0](https://github.com/styled-components/jest-styled-components/compare/v4.6.0...v4.7.0) - 2017-09-30

### Changed

- Support React 16.
- Update dependencies.

## [4.6.0](https://github.com/styled-components/jest-styled-components/compare/v4.5.0...v4.6.0) - 2017-09-09

### Changed

- [toMatchSnapshot] Make the matcher compatible with Jest v21.

## [4.5.0](https://github.com/styled-components/jest-styled-components/compare/v4.4.1...v4.5.0) - 2017-09-05

### Changed

- [toHaveStyleRule (React)] Make the matcher compatible with Jest v21 (see https://github.com/facebook/jest/pull/3972).

## [4.4.1](https://github.com/styled-components/jest-styled-components/compare/v4.4.0...v4.4.1) - 2017-08-19

### Fixed

- [toMatchSnapshot] Avoid using non-hashes class names when generating snapshots.

## [4.4.0](https://github.com/styled-components/jest-styled-components/compare/v4.3.0...v4.4.0) - 2017-08-11

### Added

- [toMatchSnapshot] Add `modifier` option to search for pseudo classes and attributes.

## [4.3.0](https://github.com/styled-components/jest-styled-components/compare/v4.2.2...v4.3.0) - 2017-07-31

### Added

- [toMatchSnapshot] Accept a third options parameter to search for rules nested within At-rules.

## [4.2.2](https://github.com/styled-components/jest-styled-components/compare/v4.2.1...v4.2.2) - 2017-07-24

### Fixed

- [toMatchSnapshot] Handle non Styled Components class names with leading white spaces.

## [4.2.1](https://github.com/styled-components/jest-styled-components/compare/v4.2.0...v4.2.1) - 2017-07-23

### Fixed

- [toMatchSnapshot] Handle class names with trailing white spaces.

## [4.2.0](https://github.com/styled-components/jest-styled-components/compare/v4.1.2...v4.2.0) - 2017-07-20

### Changed

- [toHaveStyleRule (React)] Accept regular expressions as a second parameter.

## [4.1.2](https://github.com/styled-components/jest-styled-components/compare/v4.1.1...v4.1.2) - 2017-07-20

### Fixed

- [toHaveStyleRule (React)] Avoid showing Enzyme errors when class names are not present in the tree.

## [4.1.1](https://github.com/styled-components/jest-styled-components/compare/v4.1.0...v4.1.1) - 2017-07-20

### Fixed

- [toMatchSnapshot] Fix regression introduced in 4.1.0 which broke the support for Styled Components < 2.

## [4.1.0](https://github.com/styled-components/jest-styled-components/compare/v4.0.3...v4.1.0) - 2017-07-20

### Changed

- [toMatchSnapshot] Preserve custom (i.e. not generated by Styled Components) class names.

## [4.0.3](https://github.com/styled-components/jest-styled-components/compare/v4.0.2...v4.0.3) - 2017-07-18

### Fixed

- [toMatchSnapshot] Collect unique class names and avoid skipping indexes in placeholders.
- [toHaveStyleRule (React)] Support `null` components.

## [4.0.2](https://github.com/styled-components/jest-styled-components/compare/v4.0.1...v4.0.2) - 2017-07-17

### Fixed

- [toMatchSnapshot] Make the replace regular expression less greedy (i.e. stop at the first match).

## [4.0.1](https://github.com/styled-components/jest-styled-components/compare/v4.0.0...v4.0.1) - 2017-07-16

### Fixed

- [toMatchSnapshot] Replace class names inside the `className` attribute only.

## [4.0.0](https://github.com/styled-components/jest-styled-components/compare/v3.3.2...v4.0.0) - 2017-07-15

### Added

- [toMatchSnapshot] Replace class names generated by Styled Components with placeholders.

### Changed

- Update dependencies.
- Improve README.
- Format code with Prettier.
- Refactor folders and tests.

### Removed

- Remove `toMatchStyledComponentsSnapshot` matcher.
