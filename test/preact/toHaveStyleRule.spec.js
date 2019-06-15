import { mount, shallow } from 'enzyme';
import React from 'react';
import styled from 'styled-components';

const toHaveStyleRule = (component, property, value, options) => {
  expect(shallow(component)).toHaveStyleRule(property, value, options);
  expect(mount(component)).toHaveStyleRule(property, value, options);
};

it('basic', () => {
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  toHaveStyleRule(<Wrapper />, 'background', 'papayawhip');
});
