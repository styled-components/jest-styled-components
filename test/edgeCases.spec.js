import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import styled, { createGlobalStyle, css, keyframes, StyleSheetManager } from 'styled-components';
import { setStyleRuleOptions } from '../src';
import { enableCSSCache, disableCSSCache } from '../src/utils';

describe('edge cases', () => {
  describe('weird CSS values', () => {
    it('url() with parentheses and special chars', () => {
      const Bg = styled.div`
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E");
      `;
      const tree = renderer.create(<Bg />).toJSON();
      expect(tree).toHaveStyleRule(
        'background',
        expect.stringContaining('data:image/svg+xml')
      );
      expect(tree).toMatchSnapshot();
    });

    it('calc() with nested operations', () => {
      const Box = styled.div`
        width: calc(100% - (2 * 16px) + var(--offset, 0px));
      `;
      const tree = renderer.create(<Box />).toJSON();
      expect(tree).toHaveStyleRule('width', 'calc(100% - (2 * 16px) + var(--offset,0px))');
    });

    it('CSS custom properties', () => {
      const Themed = styled.div`
        --primary: #ff0000;
        color: var(--primary);
      `;
      const tree = renderer.create(<Themed />).toJSON();
      expect(tree).toHaveStyleRule('--primary', '#ff0000');
      expect(tree).toHaveStyleRule('color', 'var(--primary)');
    });

    it('content with quotes and escapes', () => {
      const Pseudo = styled.div`
        &::before {
          content: "hello 'world' \\"quoted\\"";
        }
      `;
      const tree = renderer.create(<Pseudo />).toJSON();
      expect(tree).toHaveStyleRule('content', "\"hello 'world' \\\"quoted\\\"\"", {
        modifier: '::before',
      });
    });

    it('empty string value', () => {
      const Empty = styled.div`
        content: "";
      `;
      const tree = renderer.create(<Empty />).toJSON();
      expect(tree).toHaveStyleRule('content', '""');
    });

    it('value with semicolons in strings', () => {
      const Semi = styled.div`
        background: url("file;name.png");
      `;
      const tree = renderer.create(<Semi />).toJSON();
      expect(tree).toHaveStyleRule('background', expect.stringContaining('file'));
    });

    it('very long CSS value', () => {
      const longShadow = Array.from({ length: 50 }, (_, i) =>
        `${i}px ${i}px ${i}px rgba(0,0,0,0.${i})`
      ).join(',');
      const Shadow = styled.div`
        box-shadow: ${longShadow};
      `;
      const tree = renderer.create(<Shadow />).toJSON();
      expect(tree).toHaveStyleRule('box-shadow', expect.stringContaining('rgba'));
    });

    it('rgb/hsl with spaces after commas', () => {
      const Colors = styled.div`
        color: rgb(255, 0, 0);
        background: hsl(120, 100%, 50%);
      `;
      const tree = renderer.create(<Colors />).toJSON();
      // stylis strips spaces after commas
      expect(tree).toHaveStyleRule('color', 'rgb(255,0,0)');
      expect(tree).toHaveStyleRule('background', 'hsl(120,100%,50%)');
    });

    it('modern color functions', () => {
      const Modern = styled.div`
        color: oklch(0.7 0.15 180);
      `;
      const tree = renderer.create(<Modern />).toJSON();
      expect(tree).toHaveStyleRule('color', 'oklch(0.7 0.15 180)');
    });
  });

  describe('at-rules', () => {
    it('@keyframes does not break matcher', () => {
      const spin = keyframes`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      `;
      const Spinner = styled.div`
        animation: ${spin} 1s linear infinite;
        color: red;
      `;
      const tree = renderer.create(<Spinner />).toJSON();
      expect(tree).toHaveStyleRule('color', 'red');
      expect(tree).toMatchSnapshot();
    });

    it('@keyframes animation value is assertable', () => {
      const spin = keyframes`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      `;
      const Spinner = styled.div`
        animation: ${spin} 2s ease-in;
      `;
      const tree = renderer.create(<Spinner />).toJSON();
      expect(tree).toHaveStyleRule('animation', /\S+ 2s ease-in/);
    });

    it('multiple keyframes on one component', () => {
      const spin = keyframes`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      `;
      const fade = keyframes`
        from { opacity: 0; }
        to { opacity: 1; }
      `;
      const Animated = styled.div`
        animation: ${spin} 1s, ${fade} 0.5s;
      `;
      const tree = renderer.create(<Animated />).toJSON();
      expect(tree).toHaveStyleRule('animation', /\S+ 1s,\S+ 0\.5s/);
      expect(tree).toMatchSnapshot();
    });

    it('animation-name shorthand', () => {
      const spin = keyframes`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      `;
      const Spinner = styled.div`
        animation-name: ${spin};
        animation-duration: 2s;
      `;
      const tree = renderer.create(<Spinner />).toJSON();
      expect(tree).toHaveStyleRule('animation-name', /\S+/);
      expect(tree).toHaveStyleRule('animation-duration', '2s');
    });

    it('@media with complex query', () => {
      const Responsive = styled.div`
        @media (min-width: 768px) and (orientation: landscape) and (hover: hover) {
          color: blue;
        }
      `;
      const tree = renderer.create(<Responsive />).toJSON();
      expect(tree).toHaveStyleRule('color', 'blue', {
        media: '(min-width: 768px) and (orientation: landscape) and (hover: hover)',
      });
    });

    it('triple nested at-rules (two different types)', () => {
      const Deep = styled.div`
        @supports (display: grid) {
          @media (min-width: 768px) {
            color: green;
          }
          @media (max-width: 640px) {
            color: orange;
          }
        }
      `;
      const tree = renderer.create(<Deep />).toJSON();
      expect(tree).toHaveStyleRule('color', 'green', {
        supports: '(display: grid)',
        media: '(min-width: 768px)',
      });
      expect(tree).toHaveStyleRule('color', 'orange', {
        supports: '(display: grid)',
        media: '(max-width: 640px)',
      });
    });

    it('@media only, no other styles', () => {
      const MediaOnly = styled.div`
        @media (max-width: 640px) {
          display: none;
        }
      `;
      const tree = renderer.create(<MediaOnly />).toJSON();
      expect(tree).not.toHaveStyleRule('display');
      expect(tree).toHaveStyleRule('display', 'none', {
        media: '(max-width: 640px)',
      });
    });
  });

  describe('selectors', () => {
    it('deeply nested combinators', () => {
      const Nav = styled.nav`
        & > ul > li > a {
          color: blue;
        }
      `;
      const tree = renderer.create(<Nav />).toJSON();
      expect(tree).toHaveStyleRule('color', 'blue', {
        modifier: '> ul > li > a',
      });
    });

    it('attribute selectors with special characters', () => {
      const Link = styled.a`
        &[href*="example.com"] {
          color: green;
        }
      `;
      const tree = renderer.create(<Link />).toJSON();
      expect(tree).toHaveStyleRule('color', 'green', {
        modifier: '[href*="example.com"]',
      });
    });

    it('multiple pseudo-selectors chained', () => {
      const Input = styled.input`
        &:focus:not(:disabled):not(:read-only) {
          border-color: blue;
        }
      `;
      const tree = renderer.create(<Input />).toJSON();
      expect(tree).toHaveStyleRule('border-color', 'blue', {
        modifier: ':focus:not(:disabled):not(:read-only)',
      });
    });

    it('component selector via css helper', () => {
      const Icon = styled.span`color: grey;`;
      const Button = styled.button`
        ${Icon} {
          color: white;
        }
      `;
      const tree = renderer.create(
        <Button><Icon /></Button>
      ).toJSON();
      expect(tree).toHaveStyleRule('color', 'white', {
        modifier: css`${Icon}`,
      });
    });
  });

  describe('modern CSS features', () => {
    it('@container queries', () => {
      const Card = styled.div`
        container-type: inline-size;
        @container (min-width: 400px) {
          font-size: 1.5rem;
        }
      `;
      const tree = renderer.create(<Card />).toJSON();
      expect(tree).toHaveStyleRule('container-type', 'inline-size');
      expect(tree).toHaveStyleRule('font-size', '1.5rem', {
        container: '(min-width: 400px)',
      });
      expect(tree).toMatchSnapshot();
    });

    it('@layer', () => {
      const Layered = styled.div`
        @layer utilities {
          color: red;
        }
      `;
      const tree = renderer.create(<Layered />).toJSON();
      expect(tree).toHaveStyleRule('color', 'red', { layer: 'utilities' });
      expect(tree).toMatchSnapshot();
    });

    it('nesting with &', () => {
      const Nested = styled.div`
        color: black;
        & .child {
          color: blue;
        }
        &:hover {
          color: red;
        }
      `;
      const tree = renderer.create(<Nested />).toJSON();
      expect(tree).toHaveStyleRule('color', 'black');
      expect(tree).toHaveStyleRule('color', 'red', { modifier: ':hover' });
      expect(tree).toHaveStyleRule('color', 'blue', { modifier: '.child' });
    });

    it('@starting-style', () => {
      const Fade = styled.div`
        opacity: 1;
        transition: opacity 0.3s;
        @starting-style {
          opacity: 0;
        }
      `;
      const tree = renderer.create(<Fade />).toJSON();
      expect(tree).toHaveStyleRule('opacity', '1');
      expect(tree).toMatchSnapshot();
    });

    it('color-mix()', () => {
      const Mixed = styled.div`
        color: color-mix(in srgb, red 50%, blue);
      `;
      const tree = renderer.create(<Mixed />).toJSON();
      expect(tree).toHaveStyleRule('color', 'color-mix(in srgb,red 50%,blue)');
    });

    it('container-name and container shorthand', () => {
      const Named = styled.div`
        container: sidebar / inline-size;
      `;
      const tree = renderer.create(<Named />).toJSON();
      expect(tree).toHaveStyleRule('container', 'sidebar / inline-size');
    });

    it('subgrid', () => {
      const Grid = styled.div`
        display: grid;
        grid-template-columns: subgrid;
      `;
      const tree = renderer.create(<Grid />).toJSON();
      expect(tree).toHaveStyleRule('grid-template-columns', 'subgrid');
    });

    it('anchor positioning', () => {
      const Anchored = styled.div`
        position: absolute;
        position-anchor: --my-anchor;
        top: anchor(bottom);
        left: anchor(right);
      `;
      const tree = renderer.create(<Anchored />).toJSON();
      expect(tree).toHaveStyleRule('position-anchor', '--my-anchor');
    });

    it('light-dark()', () => {
      const Auto = styled.div`
        color: light-dark(black, white);
      `;
      const tree = renderer.create(<Auto />).toJSON();
      expect(tree).toHaveStyleRule('color', 'light-dark(black,white)');
    });

    it('scroll-timeline and view-transition', () => {
      const Scroll = styled.div`
        scroll-timeline-name: --my-scroll;
        view-transition-name: card;
      `;
      const tree = renderer.create(<Scroll />).toJSON();
      expect(tree).toHaveStyleRule('scroll-timeline-name', '--my-scroll');
      expect(tree).toHaveStyleRule('view-transition-name', 'card');
    });
  });

  describe('broken/unusual CSS', () => {
    it('duplicate properties (last wins)', () => {
      const Dup = styled.div`
        color: red;
        color: blue;
      `;
      const tree = renderer.create(<Dup />).toJSON();
      // Last declaration should win
      expect(tree).toHaveStyleRule('color', 'blue');
    });

    it('vendor prefixed properties', () => {
      const Prefixed = styled.div`
        -webkit-appearance: none;
        -moz-appearance: none;
      `;
      const tree = renderer.create(<Prefixed />).toJSON();
      expect(tree).toHaveStyleRule('-webkit-appearance', 'none');
    });

    it('empty styled component', () => {
      const Empty = styled.div``;
      const tree = renderer.create(<Empty />).toJSON();
      expect(tree).not.toHaveStyleRule('color');
      expect(tree).toMatchSnapshot();
    });

    it('styled component with only whitespace', () => {
      const Whitespace = styled.div`

      `;
      const tree = renderer.create(<Whitespace />).toJSON();
      expect(tree).not.toHaveStyleRule('color');
    });

    it('styled component with comments in CSS', () => {
      const Commented = styled.div`
        /* this is a comment */
        color: red;
        /* another comment */
      `;
      const tree = renderer.create(<Commented />).toJSON();
      expect(tree).toHaveStyleRule('color', 'red');
    });

    it('!important values', () => {
      const Important = styled.div`
        color: red !important;
      `;
      const tree = renderer.create(<Important />).toJSON();
      expect(tree).toHaveStyleRule('color', 'red !important');
    });
  });

  describe('component patterns', () => {
    it('deeply nested styled components', () => {
      const A = styled.div`color: red;`;
      const B = styled(A)`padding: 1px;`;
      const C = styled(B)`margin: 2px;`;
      const D = styled(C)`border: none;`;
      const E = styled(D)`opacity: 0.5;`;

      const tree = renderer.create(<E />).toJSON();
      expect(tree).toHaveStyleRule('color', 'red');
      expect(tree).toHaveStyleRule('opacity', '0.5');
    });

    it('component with many props generating different styles', () => {
      const Flex = styled.div`
        display: flex;
        flex-direction: ${p => p.column ? 'column' : 'row'};
        align-items: ${p => p.center ? 'center' : 'stretch'};
        gap: ${p => p.gap || '0px'};
      `;
      const tree = renderer.create(<Flex column center gap="16px" />).toJSON();
      expect(tree).toHaveStyleRule('flex-direction', 'column');
      expect(tree).toHaveStyleRule('align-items', 'center');
      expect(tree).toHaveStyleRule('gap', '16px');
    });

    it('null/undefined children in tree', () => {
      const Wrapper = styled.div`color: red;`;
      const tree = renderer.create(
        <Wrapper>
          {null}
          {undefined}
          {false}
          <span>real child</span>
          {0}
        </Wrapper>
      ).toJSON();
      expect(tree).toHaveStyleRule('color', 'red');
      expect(tree).toMatchSnapshot();
    });

    it('RTL container.firstChild', () => {
      const Box = styled.div`padding: 8px;`;
      const { container } = render(<Box />);
      expect(container.firstChild).toHaveStyleRule('padding', '8px');
    });

    it('createGlobalStyle with selector option', () => {
      const Global = createGlobalStyle`
        body {
          margin: 0;
          font-family: sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `;
      render(<Global />);
      expect(document.documentElement).toHaveStyleRule('margin', '0', {
        selector: 'body',
      });
      expect(document.documentElement).toHaveStyleRule('box-sizing', 'border-box', {
        selector: '*',
      });
    });
  });

  describe('object syntax styles', () => {
    it('basic object syntax', () => {
      const Box = styled.div({
        color: 'red',
        padding: '8px',
        margin: '16px',
      });
      const tree = renderer.create(<Box />).toJSON();
      expect(tree).toHaveStyleRule('color', 'red');
      expect(tree).toHaveStyleRule('padding', '8px');
      expect(tree).toHaveStyleRule('margin', '16px');
      expect(tree).toMatchSnapshot();
    });

    it('object syntax with dynamic props', () => {
      const Button = styled.div(props => ({
        color: props.primary ? 'white' : 'black',
        backgroundColor: props.primary ? 'blue' : 'grey',
      }));

      const primaryTree = renderer.create(<Button primary />).toJSON();
      expect(primaryTree).toHaveStyleRule('color', 'white');
      expect(primaryTree).toHaveStyleRule('background-color', 'blue');

      const defaultTree = renderer.create(<Button />).toJSON();
      expect(defaultTree).toHaveStyleRule('color', 'black');
      expect(defaultTree).toHaveStyleRule('background-color', 'grey');
    });

    it('object syntax with nested selectors', () => {
      const Link = styled.a({
        color: 'blue',
        textDecoration: 'none',
        '&:hover': {
          color: 'darkblue',
          textDecoration: 'underline',
        },
      });
      const tree = renderer.create(<Link />).toJSON();
      expect(tree).toHaveStyleRule('color', 'blue');
      expect(tree).toHaveStyleRule('text-decoration', 'none');
      expect(tree).toHaveStyleRule('color', 'darkblue', { modifier: ':hover' });
      expect(tree).toHaveStyleRule('text-decoration', 'underline', { modifier: ':hover' });
    });
  });

  describe('as prop', () => {
    it('renders as a different element with styles intact', () => {
      const Button = styled.button`
        color: red;
        padding: 8px;
      `;
      const tree = renderer.create(<Button as="a" href="/home">Link</Button>).toJSON();
      expect(tree.type).toBe('a');
      expect(tree.props.href).toBe('/home');
      expect(tree).toHaveStyleRule('color', 'red');
      expect(tree).toHaveStyleRule('padding', '8px');
      expect(tree).toMatchSnapshot();
    });

    it('toHaveStyleRule works on component rendered with as', () => {
      const Heading = styled.h1`
        font-size: 2rem;
        font-weight: bold;
      `;
      const tree = renderer.create(<Heading as="h3">Sub</Heading>).toJSON();
      expect(tree.type).toBe('h3');
      expect(tree).toHaveStyleRule('font-size', '2rem');
      expect(tree).toHaveStyleRule('font-weight', 'bold');
    });
  });

  describe('transient props', () => {
    it('interpolates transient props into CSS correctly', () => {
      const Box = styled.div`
        color: ${props => props.$color || 'black'};
        font-size: ${props => props.$size || '14px'};
      `;
      const tree = renderer.create(<Box $color="red" $size="20px" />).toJSON();
      expect(tree).toHaveStyleRule('color', 'red');
      expect(tree).toHaveStyleRule('font-size', '20px');
    });

    it('transient props do not appear in rendered HTML attributes', () => {
      const Box = styled.div`
        color: ${props => props.$color || 'black'};
        font-size: ${props => props.$size || '14px'};
      `;
      const tree = renderer.create(<Box $color="red" $size="20px" />).toJSON();
      expect(tree.props.$color).toBeUndefined();
      expect(tree.props.$size).toBeUndefined();
      expect(tree.props).not.toHaveProperty('$color');
      expect(tree.props).not.toHaveProperty('$size');
      expect(tree).toMatchSnapshot();
    });
  });

  describe('custom elements', () => {
    it('styled custom element with class prop', () => {
      const MyWidget = styled('my-widget')`
        color: red;
        padding: 8px;
        display: block;
      `;
      const tree = renderer.create(<MyWidget />).toJSON();
      expect(tree.type).toBe('my-widget');
      // SC uses `class` instead of `className` for custom elements
      expect(tree.props.class || tree.props.className).toBeDefined();
      expect(tree).toHaveStyleRule('color', 'red');
      expect(tree).toHaveStyleRule('padding', '8px');
      expect(tree).toHaveStyleRule('display', 'block');
      expect(tree).toMatchSnapshot();
    });
  });

  describe('StyleSheetManager', () => {
    it('namespace renders correct snapshot with prefixed selectors', () => {
      const Box = styled.div`
        color: blue;
        margin: 4px;
      `;
      const tree = renderer.create(
        <StyleSheetManager namespace="#app">
          <Box />
        </StyleSheetManager>
      ).toJSON();
      expect(tree).toMatchSnapshot();
      expect(tree).toHaveStyleRule('color', 'blue', { namespace: '#app' });
      expect(tree).toHaveStyleRule('margin', '4px', { namespace: '#app' });
    });

    it('without namespace, toHaveStyleRule works normally', () => {
      const Box = styled.div`
        color: green;
        padding: 12px;
      `;
      const tree = renderer.create(
        <StyleSheetManager>
          <Box />
        </StyleSheetManager>
      ).toJSON();
      expect(tree).toHaveStyleRule('color', 'green');
      expect(tree).toHaveStyleRule('padding', '12px');
    });

    it('global namespace via setStyleRuleOptions', () => {
      setStyleRuleOptions({ namespace: '#app' });
      try {
        const Box = styled.div`
          color: purple;
        `;
        const tree = renderer.create(
          <StyleSheetManager namespace="#app">
            <Box />
          </StyleSheetManager>
        ).toJSON();
        expect(tree).toHaveStyleRule('color', 'purple');
      } finally {
        setStyleRuleOptions({ namespace: '' });
      }
    });
  });

  describe('cache integrity under stress', () => {
    beforeAll(() => enableCSSCache());
    afterAll(() => disableCSSCache());

    it('rapid component creation with cache', () => {
      for (let i = 0; i < 20; i++) {
        const C = styled.div`color: hsl(${i * 18}, 50%, 50%);`;
        const tree = renderer.create(<C />).toJSON();
        expect(tree).toHaveStyleRule('color', expect.any(String));
      }
    });

    it('snapshot after cache stress', () => {
      const Fresh = styled.div`background: lime;`;
      const tree = renderer.create(<Fresh />).toJSON();
      expect(tree).toHaveStyleRule('background', 'lime');
      expect(tree).toMatchSnapshot();
    });
  });
});
