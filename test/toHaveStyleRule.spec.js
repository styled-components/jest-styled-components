import { render } from "@testing-library/react";
import { mount, shallow } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";
import styled, { css, ThemeProvider } from "styled-components";
import "../src";

const notToHaveStyleRule = (component, property, value) => {
  expect(renderer.create(component).toJSON()).not.toHaveStyleRule(
    property,
    value
  );
  expect(shallow(component)).not.toHaveStyleRule(property, value);
  expect(mount(component)).not.toHaveStyleRule(property, value);
  expect(render(component).container.firstChild).not.toHaveStyleRule(
    property,
    value
  );
};

const toHaveStyleRule = (component, property, value, options) => {
  expect(renderer.create(component).toJSON()).toHaveStyleRule(
    property,
    value,
    options
  );
  expect(shallow(component)).toHaveStyleRule(property, value, options);
  expect(mount(component)).toHaveStyleRule(property, value, options);
  expect(render(component).container.firstChild).toHaveStyleRule(
    property,
    value,
    options
  );
};

it("null", () => {
  expect(null).not.toHaveStyleRule("a", "b");
});

it("non-styled", () => {
  notToHaveStyleRule(<div />, "a", "b");
});

it("message when rules not found", () => {
  expect(() =>
    expect(renderer.create(<div />).toJSON()).toHaveStyleRule("color", "black")
  ).toThrowErrorMatchingSnapshot();
});

it("message when rules not found using options", () => {
  const Button = styled.button`
    color: red;
  `;

  toHaveStyleRule(<Button />, "color", "red");
  expect(() =>
    expect(renderer.create(<Button />).toJSON()).toHaveStyleRule(
      "color",
      "red",
      {
        media: "(max-width:640px)",
        modifier: ":hover"
      }
    )
  ).toThrowErrorMatchingSnapshot();
});

it("message when property not found", () => {
  const Button = styled.button`
    color: red;
  `;

  expect(() =>
    expect(renderer.create(<Button />).toJSON()).toHaveStyleRule(
      "background-color",
      "black"
    )
  ).toThrowErrorMatchingSnapshot();
});

it("message when value does not match", () => {
  const Wrapper = styled.section`
    background: orange;
  `;

  expect(() => {
    expect(renderer.create(<Wrapper />).toJSON()).toHaveStyleRule(
      "background",
      "red"
    );
  }).toThrowErrorMatchingSnapshot();
});

it("non existing", () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  expect(() => {
    expect(shallow(<Wrapper />).find("div")).toHaveStyleRule(
      "background",
      "papayawhip"
    );
  }).toThrowErrorMatchingSnapshot();
});

it("basic", () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  toHaveStyleRule(<Wrapper />, "background", "papayawhip");
});

it("regex", () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  toHaveStyleRule(<Wrapper />, "background", /^p/);
});

it("complex string", () => {
  const Wrapper = styled.section`
    border: 1px solid rgba(0, 0, 0, 0.125);
  `;

  toHaveStyleRule(<Wrapper />, "border", "1px solid rgba(0,0,0,0.125)");
});

it("undefined", () => {
  const Button = styled.button`
    cursor: ${({ disabled }) => !disabled && "pointer"};
    opacity: ${({ disabled }) => disabled && ".65"};
  `;

  toHaveStyleRule(<Button />, "opacity", undefined);
  toHaveStyleRule(<Button />, "cursor", "pointer");
  toHaveStyleRule(<Button disabled />, "opacity", ".65");
  toHaveStyleRule(<Button disabled />, "cursor", undefined);
});

it('negated ".not" modifier with no value', () => {
  const Button = styled.button`
    opacity: ${({ disabled }) => disabled && ".65"};
  `;

  notToHaveStyleRule(<Button />, "opacity");
  toHaveStyleRule(<Button disabled />, "opacity", ".65");
});

it('negated ".not" modifier with value', () => {
  const Button = styled.button`
    opacity: 0.65;
  `;

  notToHaveStyleRule(<Button />, "opacity", "0.50");
  notToHaveStyleRule(<Button />, "opacity", "");
  notToHaveStyleRule(<Button />, "opacity", null);
  notToHaveStyleRule(<Button />, "opacity", false);
  notToHaveStyleRule(<Button />, "opacity", undefined);
});

it("jest asymmetric matchers", () => {
  const Button = styled.button`
    border: 0.1em solid
      ${({ transparent }) => (transparent ? "transparent" : "black")};
  `;

  toHaveStyleRule(<Button />, "border", expect.any(String));
  toHaveStyleRule(<Button />, "border", expect.stringMatching("solid"));
  toHaveStyleRule(<Button />, "border", expect.stringMatching(/^0.1em/));
  toHaveStyleRule(<Button />, "border", expect.stringContaining("black"));
  notToHaveStyleRule(
    <Button transparent />,
    "border",
    expect.stringContaining("black")
  );
  toHaveStyleRule(
    <Button transparent />,
    "border",
    expect.stringContaining("transparent")
  );
  notToHaveStyleRule(<Button />, "color", expect.any(String));
  notToHaveStyleRule(<Button />, "color", expect.anything());
});

it("any component", () => {
  const Link = ({ className, children }) => (
    <a className={className}>{children}</a>
  );

  const StyledLink = styled(Link)`
    color: palevioletred;
    font-weight: bold;
  `;

  toHaveStyleRule(
    <StyledLink>Styled, exciting Link</StyledLink>,
    "color",
    "palevioletred"
  );
});

it("styled child", () => {
  const Parent = styled.div`
    color: red;
  `;

  const StyledChild = styled(Parent)`
    padding: 0;
  `;

  toHaveStyleRule(<StyledChild />, "color", "red");
});

it("theming", () => {
  const Button = styled.button`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;

    color: ${props => props.theme.main};
    border: 2px solid ${props => props.theme.main};
  `;

  Button.defaultProps = {
    theme: {
      main: "palevioletred"
    }
  };

  const theme = {
    main: "mediumseagreen"
  };

  toHaveStyleRule(<Button>Normal</Button>, "color", "palevioletred");

  const component = (
    <ThemeProvider theme={theme}>
      <Button>Themed</Button>
    </ThemeProvider>
  );

  expect(renderer.create(component).toJSON()).toHaveStyleRule(
    "color",
    "mediumseagreen"
  );
  expect(mount(component)).toHaveStyleRule("color", "mediumseagreen");
});

it("at rules", () => {
  const Wrapper = styled.section`
    color: red;
    @media (max-width: 640px) {
      color: green;
    }
    @media (min-width: 200px) and (max-width: 640px) {
      color: blue;
    }
    @media (min-width: 576px) and (max-width: 767.98px) {
      color: red;
    }
  `;

  toHaveStyleRule(<Wrapper />, "color", "red");
  toHaveStyleRule(<Wrapper />, "color", "green", {
    media: "(max-width:640px)"
  });
  toHaveStyleRule(<Wrapper />, "color", "green", {
    media: "(max-width: 640px)"
  });
  toHaveStyleRule(<Wrapper />, "color", "blue", {
    media: "(min-width:200px) and (max-width:640px)"
  });
  toHaveStyleRule(<Wrapper />, "color", "blue", {
    media: "(min-width: 200px) and (max-width: 640px)"
  });
  toHaveStyleRule(<Wrapper />, "color", "blue", {
    media: "(min-width: 200px) and (max-width:640px)"
  });
  toHaveStyleRule(<Wrapper />, "color", "blue", {
    media: "(min-width:200px) and (max-width: 640px)"
  });
  toHaveStyleRule(<Wrapper />, "color", "red", {
    media: "(min-width: 576px) and (max-width: 767.98px)"
  });
});

it("selector modifiers", () => {
  const Link = styled.a`
    color: white;

    &:hover {
      color: blue;
    }
    &::after {
      color: red;
    }
    &[href*="somelink.com"] {
      color: green;
    }
    > div {
      color: yellow;
    }
    span {
      color: purple;
    }
    .child {
      color: orange;
    }
    &.self {
      color: black;
    }

    .one,
    .two {
      color: olive;
    }

    ~ div {
      &.one,
      &.two {
        color: pink;
      }
    }

    + div {
      .one,
      .two {
        color: salmon;
      }
    }

    .parent & {
      color: red;
    }

    && {
      color: fuchsia;
    }

    &&& {
      color: olive;
    }

    & & {
      color: deepskyblue;
    }
  `;

  toHaveStyleRule(<Link />, "color", "white");
  toHaveStyleRule(<Link />, "color", "blue", {
    modifier: ":hover"
  });
  toHaveStyleRule(<Link />, "color", "red", {
    modifier: "::after"
  });
  toHaveStyleRule(<Link />, "color", "green", {
    modifier: "[href*='somelink.com']"
  });
  toHaveStyleRule(<Link />, "color", "yellow", {
    modifier: "> div"
  });
  toHaveStyleRule(<Link />, "color", "purple", {
    modifier: "span"
  });
  toHaveStyleRule(<Link />, "color", "purple", {
    modifier: " span"
  });
  toHaveStyleRule(<Link />, "color", "orange", {
    modifier: ".child"
  });
  toHaveStyleRule(<Link />, "color", "orange", {
    modifier: " .child"
  });
  toHaveStyleRule(<Link />, "color", "black", {
    modifier: "&.self"
  });
  toHaveStyleRule(<Link />, "color", "olive", {
    modifier: ".one"
  });
  toHaveStyleRule(<Link />, "color", "olive", {
    modifier: ".two"
  });
  toHaveStyleRule(<Link />, "color", "pink", {
    modifier: "~ div.one"
  });
  toHaveStyleRule(<Link />, "color", "salmon", {
    modifier: "+ div .two"
  });
  toHaveStyleRule(<Link />, "color", "red", {
    modifier: ".parent &"
  });
  toHaveStyleRule(<Link />, "color", "fuchsia", {
    modifier: "&&"
  });
  toHaveStyleRule(<Link />, "color", "olive", {
    modifier: "&&&"
  });
  toHaveStyleRule(<Link />, "color", "deepskyblue", {
    modifier: "& &"
  });
});

it("component modifiers", () => {
  const Text = styled.span`
    color: grey;
  `;

  const Link = styled.a`
    color: white;

    ${Text} {
      color: blue;
    }

    > ${Text} span {
      color: green;
    }

    ${Text} & {
      color: purple;
    }
  `;

  toHaveStyleRule(<Link />, "color", "white");
  toHaveStyleRule(<Text />, "color", "grey");
  toHaveStyleRule(
    <Link>
      <Text />
    </Link>,
    "color",
    "blue",
    {
      // eslint-disable-next-line prettier/prettier
      modifier: css`
        ${Text}
      `
    }
  );
  toHaveStyleRule(
    <Link>
      <Text />
    </Link>,
    "color",
    "green",
    {
      modifier: css`> ${Text} span`
    }
  );
  toHaveStyleRule(
    <Link>
      <Text />
    </Link>,
    "color",
    "purple",
    {
      // eslint-disable-next-line prettier/prettier
      modifier: css`
        ${Text} &
      `
    }
  );
});

it("nested", () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  const MyComponent = () => <Wrapper />;

  toHaveStyleRule(<MyComponent />, "background", "papayawhip");
});

it("empty children", () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  Wrapper.defaultProps = {
    children: ""
  };

  toHaveStyleRule(<Wrapper />, "background", "papayawhip");
});
