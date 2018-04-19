import React from 'react';

module.exports = new Proxy(
  {},
  {
    get: function getter(target, key) {
      const StyledComponentMock = () => null;

      StyledComponentMock.displayName = `Styled${key}`;
      StyledComponentMock.extend = () => StyledComponentMock;
      StyledComponentMock.withComponent = Component => {
        const NewStyledComponent = props => <Component {...props} />;
        const suffix = Component.name ? `_${Component.name}` : '';

        NewStyledComponent.displayName = `Styled${key}${suffix}`;

        return NewStyledComponent;
      };

      return StyledComponentMock;
    },
  },
);
