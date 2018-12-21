global._babelPolyfill || require('babel-polyfill');
import Enzyme, { mount, shallow, render } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


const testsContext = require.context('.', true, /\.specs\.js$/);
testsContext.keys().forEach(testsContext);

const  componentsContext = require.context('./components', true, /\/.js$/);
componentsContext.keys().forEach(componentsContext);
