import React from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import defaultRules from '../../src/defaultRules';

const handlerSubmit = (a, done) => {
  done(true);
  alert('Submit callback success and reset the form');
};

const OptionalExample = () => (
  <div>
    <h2>Form with optional input</h2>
    <Form
      validateLang="en"
      submitCallback={handlerSubmit}
      rules={defaultRules}
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
        />

        <Input
          optional
          label="Enter your email subscribe (optional)"
          errorClassName="error-message"
          wrapClassName="input-group"
          type="text"
          name="email"
          rule="isEmail"
        />
      </div>

      <br />

    </Form></div>
);

export default OptionalExample;
