import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import "../vitest";

configure({ adapter: new Adapter() });
