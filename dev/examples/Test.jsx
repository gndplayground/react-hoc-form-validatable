import React from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import defaultRules from '../../src/defaultRules';

const handlerSubmit = (a, done) => {
  done(true);
  alert('Submit callback success and reset the form');
};

const extendDemoRules = {
  requireCurrentOrOther: {
    rule: (value, params, input, allInputs, checkInput) => {
      if (input.value || allInputs[params[0]].value) {
        if (checkInput) {
          checkInput(params[0], allInputs[params[0]].value, null, true);
        }

        return true;
      }
      return false;
    },

    message: {
      error: {
        en: 'en',
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
          name="f1"
          rule="requireCurrentOrOther,f2"
        />
        <br />

        <Input
          label="How many items you need to ship?"
          errorClassName="error-message"
          inputClassName="input"
          wrapClassName="input-group"
          type="number"
          name="f2"
          rule="requireCurrentOrOther,f1"
        />
      </div>

      <br />

    </Form></div>
);

export default CalculatedErrorMessageExample;
