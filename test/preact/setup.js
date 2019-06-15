import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

require('../../src');

configure({ adapter: new Adapter() });
