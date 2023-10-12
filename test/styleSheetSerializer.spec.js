import { render } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import styled, { ThemeContext, ThemeProvider } from 'styled-components';
import prettyFormat, { plugins } from 'pretty-format';
import {setStyleSheetSerializerOptions} from '../serializer';
import styleSheetSerializer from '../src/styleSheetSerializer';

const toMatchSnapshot = (component) => {
  expect(renderer.create(component).toJSON()).toMatchSnapshot('react-test-renderer');
  expect(shallow(component)).toMatchSnapshot('shallow');
  expect(mount(component)).toMatchSnapshot('mount');
  expect(render(component).container.firstChild).toMatchSnapshot('react-testing-library');
};

const shallowWithTheme = (tree, theme) => {
  // this is terrible but couldn't figure out how to do it properly within the framework of enzyme
  ThemeContext._currentValue = theme;

  return shallow(tree);
};

/**
 * Serializes a value similarly to jest-snapshot
 *
 * Imitates the serialization logic inside jest-snapshot,
 * so we can pass options, including indent, to it.
 *
 * @see https://github.com/facebook/jest/blob/615084195ae1ae61ddd56162c62bbdda17587569/packages/jest-snapshot/src/utils.ts#L155-L163
 * @see https://github.com/facebook/jest/blob/615084195ae1ae61ddd56162c62bbdda17587569/packages/jest-snapshot/src/plugins.ts#L24-L32
 */
const serialize = (val, indent = 2) =>
  prettyFormat(val, {
    escapeRegex: true,
    indent,
    plugins: [
      styleSheetSerializer,
      plugins.ReactTestComponent,
      plugins.ReactElement,
      plugins.DOMElement,
      plugins.DOMCollection,
      plugins.Immutable,
      plugins.AsymmetricMatcher,
    ],
    printFunctionName: false,
  });

it('null', () => {
  expect(null).toMatchSnapshot();
});

it('non-styled', () => {
  toMatchSnapshot(<div />);
});

it('empty style', () => {
  const Component = styled.div``;

  toMatchSnapshot(<Component />);
});

it('duplicated components', () => {
  const A = styled.div`
    color: red;
  `;
  const B = styled.div`
    color: green;
  `;

  toMatchSnapshot(
    <div>
      <A /> <A /> <B />
    </div>
  );
});

it('basic', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `;

  toMatchSnapshot(
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
    </Wrapper>
  );
});

it('any component', () => {
  const Link = ({ className, children }) => <a className={className}>{children}</a>;

  const StyledLink = styled(Link)`
    color: palevioletred;
    font-weight: bold;
  `;

  toMatchSnapshot(
    <div>
      <Link>Unstyled, boring Link</Link>
      <br />
      <StyledLink>Styled, exciting Link</StyledLink>
    </div>
  );
});

it('attaching additional props', () => {
  const Div = styled.div.attrs(() => ({
    className: 'div',
  }))`
    color: red;
  `;

  toMatchSnapshot(<Div />);
});

it('leading white spaces', () => {
  const Div = () => <div className="  div" />;

  toMatchSnapshot(<Div />);
});

it('trailing white spaces', () => {
  const Div = styled.div.attrs(() => ({
    className: 'div  ',
  }))`
    color: red;
  `;

  toMatchSnapshot(<Div />);
});

it('included class name', () => {
  const Div = styled.div.attrs(() => ({
    className: 'i',
  }))`
    color: red;
  `;

  toMatchSnapshot(<Div />);
});

it('theming', () => {
  const Button = styled.button`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;

    color: ${(props) => props.theme.main};
    border: 2px solid ${(props) => props.theme.main};
  `;

  Button.defaultProps = {
    theme: {
      main: 'palevioletred',
    },
  };

  const theme = {
    main: 'mediumseagreen',
  };

  toMatchSnapshot(
    <div>
      <Button>Normal</Button>
      <ThemeProvider theme={theme}>
        <Button>Themed</Button>
      </ThemeProvider>
    </div>
  );
});

it('shallow with theme', () => {
  const Button = styled.button`
    color: ${(props) => props.theme.main};
  `;

  const theme = {
    main: 'mediumseagreen',
  };

  const wrapper = shallowWithTheme(<Button>Themed</Button>, theme);

  expect(wrapper).toMatchSnapshot();
});

it('supported css', () => {
  const Example = styled.div`
    padding: 2em 1em;
    background: papayawhip;

    &:hover {
      background: palevioletred;
    }

    @media (max-width: 600px) {
      background: tomato;

      &:hover {
        background: yellow;
      }

      @supports (top: max(1px, 0px)) {
        padding-left: max(1em, env(safe-area-inset-left, 0px));
      }
    }

    > p {
      text-decoration: underline;
    }

    html.test & {
      display: none;
    }
  `;

  toMatchSnapshot(
    <Example>
      <p>Hello World!</p>
    </Example>
  );
});

it('referring to other components', () => {
  const Link = styled.a`
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background: papayawhip;
    color: palevioletred;
  `;

  const Icon = styled.svg`
    transition: fill 0.25s;
    width: 48px;
    height: 48px;

    ${Link}:hover & {
      fill: rebeccapurple;
    }
  `;

  const Label = styled.span`
    display: flex;
    align-items: center;
    line-height: 1.2;

    &::before {
      content: '◀';
      margin: 0 10px;
    }
  `;

  const Container = styled.div`
    color: black;
  `;
  const TextWithConditionalFormatting = styled.span`
    ${Container} & {
      color: yellow;
      background-color: ${props => (props.error ? 'red' : 'green')};
    }
  `;

  const component = (
    <Container>
      <Link href="#">
        <Icon />
        <Label>Hovering my parent changes my style!</Label>
        <TextWithConditionalFormatting>I should be green</TextWithConditionalFormatting>
        <TextWithConditionalFormatting error>I should be red</TextWithConditionalFormatting>
      </Link>
    </Container>
  );

  expect(renderer.create(component).toJSON()).toMatchSnapshot('react-test-renderer');
  expect(mount(component)).toMatchSnapshot('mount');
  expect(render(component).container.firstChild).toMatchSnapshot('react-testing-library');
});

it('strips unused styles', () => {
  const BlueText = styled.div`
    color: blue;
  `;
  const RedText = styled.div`
    color: red;
  `;

  const FancyText = styled.div`
    font-size: 16px;

    ${BlueText} {
      text-align: right;
    }
    ${RedText} {
      text-align: center;
    }
  `;

  const component = (
    <FancyText>
      <BlueText>A container that has styles for an unused child</BlueText>
    </FancyText>
  );

  expect(renderer.create(component).toJSON()).toMatchSnapshot('react-test-renderer');
  expect(mount(component)).toMatchSnapshot('mount');
  expect(render(component).container.firstChild).toMatchSnapshot('react-testing-library');
});

it('referring to other unreferenced components', () => {
  const UnreferencedLink = styled.a`
    font-size: 1.5em;
  `;

  const ReferencedLink = styled(UnreferencedLink)`
    color: palevioletred;
    font-weight: bold;
  `;

  toMatchSnapshot(
    <div>
      <ReferencedLink>Styled, exciting Link</ReferencedLink>
    </div>
  );
});

it('should match the same snapshot rerendering the same element', () => {
  const StyledDiv = styled.div`
    color: palevioletred;
    font-weight: bold;
  `;

  const {rerender, container} = render(<StyledDiv />);

  expect(container).toMatchSnapshot('first-render');
  rerender(<StyledDiv />);
  expect(container).toMatchSnapshot('second-render');
});

it('allows to disable css snapshotting', () => {
  setStyleSheetSerializerOptions({ addStyles: false })
  const A = styled.div`
    color: red;
  `; const B = styled.div`
    color: red;
  `;

  toMatchSnapshot(
    <div>
      <A>Styled, exciting div</A>
      <B>Styled, exciting div</B>
    </div>
  );
});

it('allows to set a css classNameFormatter', () => {
  setStyleSheetSerializerOptions({ classNameFormatter: (index) => `styledComponent${index}`  })
  const A = styled.div`
    color: red;
  `;
  const B = styled.div`
    color: green;
  `;

  toMatchSnapshot(
    <div>
      <A>Styled, exciting div</A>
      <B>Styled, exciting div</B>
    </div>
  );
});

it('responds to indent configuration', () => {
  const Link = styled.a`
    color: blue;
  `;

  const mounted = renderer.create(<Link>Styled, exciting Link</Link>);

  expect(serialize(mounted)).toMatchInlineSnapshot(`
    ".styledComponent0 {
      color: blue;
    }

    <a
      className=\\"styledComponent0\\"
    >
      Styled, exciting Link
    </a>"
  `);

  expect(serialize(mounted, 0)).toMatchInlineSnapshot(`
    ".styledComponent0 {
    color: blue;
    }

    <a
    className=\\"styledComponent0\\"
    >
    Styled, exciting Link
    </a>"
  `);
});
