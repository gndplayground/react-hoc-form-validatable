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
  asyncTestTrue: {
    rule: (value, params) => cancelAblePromise(new Promise((resolve) => {
      setTimeout(() => { resolve(true); }, parseInt(params[0], 10));
    })),

    message: {
      error: {
        en: 'en async test1',
        vi: 'vi async test1',
      },
    },
  },
};

const validateRules = Object.assign({}, defaultRules, extendDemoRules);

const AsyncExample = () => (
  <div>
    <h2>Form with async rules</h2>
    <p>Field email and user name will simulate the validate from the server</p>
    <Form
      validateLang="en"
      submitCallback={handlerSubmit}
      rules={validateRules}
      hasResetButton
    >
      <div>
        <Input
          label="Choose your user name"
          errorClassName="error-message"
          wrapClassName="input-group"
          type="text"
          name="userName"
          rule="notEmpty|minLength,4"
          asyncRule="asyncTestTrue,2000"
        />

        <Input
          label="Enter your email"
          errorClassName="error-message"
          wrapClassName="input-group"
          type="text"
          name="userName2"
          rule="notEmpty|isEmail"
          asyncRule="asyncTestTrue,3000"
        />

        <Input
          label="Your login password"
          errorClassName="error-message"
          inputClassName="input"
          wrapClassName="input-group"
          type="password"
          name="password"
          rule="notEmpty|minLength,6"
        />
      </div>

      <br />

    </Form></div>
);

export default AsyncExample;
