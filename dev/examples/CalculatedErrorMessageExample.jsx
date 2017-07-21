import React from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import defaultRules from '../../src/defaultRules';
import cancelAblePromise from '../../src/cancelablePromise';

const handlerSubmit = (a, done) => {
  done(true);
  alert('Submit callback success and reset the form');
};

const extendDemoRules = {
  orderLimit: {
    rule: (value, params) => (value > parseInt(params[0], 10))
    && (value <= parseInt(params[1], 10)),

    message: {
      error: (value, params) => {
        if (value <= parseInt(params[0], 10)) {
          return 'The item order must greater than one, currently we do not ship oder below {0} item';
        }
        if (value > parseInt(params[1], 10)) {
          return 'Each customer can buy max {1} items';
        }
      },
    },
  },
};

const validateRules = Object.assign({}, defaultRules, extendDemoRules);

const CalculatedErrorMessageExample = () => (
  <div>
    <h2>Calculated Error Message Example</h2>
    <p>Try type 1 or greater than 5</p>
    <Form
      validateLang="en"
      submitCallback={handlerSubmit}
      rules={validateRules}
      hasResetButton
    >
      <div>
        <Input
          label="How many items you need to ship?"
          errorClassName="error-message"
          inputClassName="input"
          wrapClassName="input-group"
          type="number"
          name="password"
          rule="notEmpty|isInt|orderLimit,1,5"
        />
      </div>

      <br />

    </Form></div>
);

export default CalculatedErrorMessageExample;
