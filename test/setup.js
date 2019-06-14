import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import '../src';

configure({ adapter: new Adapter() });
