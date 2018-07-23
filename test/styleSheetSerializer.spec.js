import React from 'react'
import renderer from 'react-test-renderer'
import styled, { ThemeProvider } from 'styled-components'
import { shallow, mount } from 'enzyme'
import '../src'

const toMatchSnapshot = (name, component) => {
  expect(renderer.create(component).toJSON()).toMatchSnapshot(
    'react-test-renderer'
  )
  expect(shallow(component)).toMatchSnapshot('shallow')
  expect(mount(component)).toMatchSnapshot('mount')
}

const shallowWithTheme = (tree, theme) => {
  const context = shallow(<ThemeProvider theme={theme} />)
    .instance()
    .getChildContext()
  return shallow(tree, { context })
}

test('null', () => {
  expect(null).toMatchSnapshot()
})

test('non-styled', () => {
  toMatchSnapshot('non-styled', <div />)
})

test('empty style', () => {
  const Component = styled.div``

  toMatchSnapshot('empty style', <Component />)
})

test('duplicated components', () => {
  const A = styled.div`
    color: red;
  `
  const B = styled.div`
    color: green;
  `

  toMatchSnapshot(
    'duplicated components',
    <div>
      <A /> <A /> <B />
    </div>
  )
})

test('basic', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `

  const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `

  toMatchSnapshot(
    'basic',
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
    </Wrapper>
  )
})

test('any component', () => {
  const Link = ({ className, children }) => (
    <a className={className}>{children}</a>
  )

  const StyledLink = styled(Link)`
    color: palevioletred;
    font-weight: bold;
  `

  toMatchSnapshot(
    'any component',
    <div>
      <Link>Unstyled, boring Link</Link>
      <br />
      <StyledLink>Styled, exciting Link</StyledLink>
    </div>
  )
})

test('extending styles', () => {
  const Button = styled.button`
    color: palevioletred;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  `

  const TomatoButton = Button.extend`
    color: tomato;
    border-color: tomato;
  `

  toMatchSnapshot(
    'extending styles',
    <div>
      <Button>Normal Button</Button>
      <TomatoButton>Tomato Button</TomatoButton>
    </div>
  )
})

test('attaching additional props', () => {
  const Div = styled.div.attrs({
    className: 'div',
  })`
    color: red;
  `

  toMatchSnapshot('attaching additional props', <Div />)
})

test('leading white spaces', () => {
  const Div = () => <div className="  div" />

  toMatchSnapshot('leading white spaces', <Div />)
})

test('trailing white spaces', () => {
  const Div = styled.div.attrs({
    className: 'div  ',
  })`
    color: red;
  `

  toMatchSnapshot('trailing white spaces', <Div />)
})

test('included class name', () => {
  const Div = styled.div.attrs({
    className: 'i',
  })`
    color: red;
  `

  toMatchSnapshot('included class name', <Div />)
})

test('theming', () => {
  const Button = styled.button`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;

    color: ${props => props.theme.main};
    border: 2px solid ${props => props.theme.main};
  `

  Button.defaultProps = {
    theme: {
      main: 'palevioletred',
    },
  }

  const theme = {
    main: 'mediumseagreen',
  }

  toMatchSnapshot(
    'theming',
    <div>
      <Button>Normal</Button>
      <ThemeProvider theme={theme}>
        <Button>Themed</Button>
      </ThemeProvider>
    </div>
  )
})

test('shallow with theme', () => {
  const Button = styled.button`
    color: ${props => props.theme.main};
  `

  const theme = {
    main: 'mediumseagreen',
  }

  const wrapper = shallowWithTheme(<Button>Themed</Button>, theme)

  expect(wrapper).toMatchSnapshot()
})

test('supported css', () => {
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
    }

    > p {
      text-decoration: underline;
    }

    html.test & {
      display: none;
    }
  `

  toMatchSnapshot(
    'supported css',
    <Example>
      <p>Hello World!</p>
    </Example>
  )
})

test('referring to other components', () => {
  const Link = styled.a`
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background: papayawhip;
    color: palevioletred;
  `

  const Icon = styled.svg`
    transition: fill 0.25s;
    width: 48px;
    height: 48px;

    ${Link}:hover & {
      fill: rebeccapurple;
    }
  `

  const Label = styled.span`
    display: flex;
    align-items: center;
    line-height: 1.2;

    &::before {
      content: '◀';
      margin: 0 10px;
    }
  `

  const Container = styled.div`
    color: black;
  `
  const TextWithConditionalFormatting = styled.span`
    ${Container} & {
      color: yellow;
      background-color: ${props => (props.error ? 'red' : 'green')};
    }
  `

  const component = (
    <Link href="#">
      <Icon />
      <Label>Hovering my parent changes my style!</Label>
      <TextWithConditionalFormatting>
        I should be green
      </TextWithConditionalFormatting>
      <TextWithConditionalFormatting error>
        I should be red
      </TextWithConditionalFormatting>
    </Link>
  )

  expect(renderer.create(component).toJSON()).toMatchSnapshot(
    'react-test-renderer'
  )
  expect(mount(component)).toMatchSnapshot('mount')
})
