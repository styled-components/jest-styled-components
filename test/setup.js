import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import '../src';

configure({ adapter: new Adapter() });

// Suppress expected noise from React dev warnings and jsdom CSS parsing
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = args[0] instanceof Error ? args[0].message : String(args[0]);
  if (
    msg.startsWith('Warning:') ||
    msg.includes('Could not parse CSS stylesheet')
  ) return;
  originalConsoleError.call(console, ...args);
};
