import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import '../src';

configure({ adapter: new Adapter() });

// Suppress expected noise from React dev warnings and jsdom CSS parsing
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].startsWith('Warning:') ||
    args[0].includes('Could not parse CSS stylesheet')
  )) return;
  originalConsoleError.call(console, ...args);
};
