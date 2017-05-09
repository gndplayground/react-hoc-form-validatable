import React from 'react';
import {
  HashRouter,
  Route,
  Link,
} from 'react-router-dom';
import Basic from '../examples/Basic';
import DynamicExample from '../examples/DynamicExample';
import AsyncExample from '../examples/AsyncExample';
import CustomErrorMessageExample from '../examples/CustomErrorMessageExample';

const Routers = () => (
  <HashRouter>
    <div>
      <h1>Example for `react-hoc-form-validatable`</h1>
      <ul>
        <li><Link to="/">Basic demo</Link></li>
        <li><Link to="/examples/dynamic">Dynamic Example</Link></li>
        <li><Link to="/examples/async">Async Example</Link></li>
        <li><Link to="/examples/custom-error-message">Custom Error Message Example</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Basic} />
      <Route exact path="/examples/dynamic" component={DynamicExample} />
      <Route exact path="/examples/async" component={AsyncExample} />
      <Route exact path="/examples/custom-error-message" component={CustomErrorMessageExample} />
    </div>
  </HashRouter>
);

export default Routers;
