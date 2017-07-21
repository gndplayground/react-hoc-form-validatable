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

  asyncTestFalse: {
    rule: (value, params) => cancelAblePromise(new Promise((resolve) => {
      setTimeout(() => { resolve(false); }, parseInt(params[0], 10));
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

const CustomErrorMessageExample = () => (
  <div>
    <h2>Custom error message</h2>
    <p>Custom message in the Input Component will override error message from validation rule</p>
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
          asyncRule="asyncTestFalse,1000"
          customErrorMessages={{
            notEmpty: 'custom error for notEmpty',
            asyncTestFalse: value => `custom error async test false - value: ${value}`,
          }}
        />

        <Input
          label="Enter your email"
          errorClassName="error-message"
          wrapClassName="input-group"
          type="text"
          name="userName2"
          rule="notEmpty|isEmail"
          asyncRule="asyncTestTrue,3000"
          customErrorMessages={{
            notEmpty: 'custom error for notEmpty',
            isEmail: 'custom error for email',
          }}
        />

        <Input
          label="Your login password"
          errorClassName="error-message"
          inputClassName="input"
          wrapClassName="input-group"
          type="password"
          name="password"
          rule="notEmpty|minLength,6"
          customErrorMessages={{
            notEmpty: 'custom error for notEmpty',
            minLength: {
              en: 'custom error minLength {0} en',
              vi: 'custom error minLength {0} vi',
            },
          }}
        />
      </div>

      <br />

    </Form></div>
);

export default CustomErrorMessageExample;
