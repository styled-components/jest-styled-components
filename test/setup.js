import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import '../src';

configure({ adapter: new Adapter() });
