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

  requireCurrentOrOther: {
    rule: (value, params, input, allInputs, formControl) => {
      if (!formControl.isControlledValidate) {
        formControl.checkInput(input,
          allInputs[params[0]].name,
          allInputs[params[0]].value, null);
      }

      if (input.value && allInputs[params[0]].value) {
        return false;
      }

      if (input.value || allInputs[params[0]].value) {
        return true;
      }

      return false;
    },

    message: {
      error: (value, params, input, allInputs) => {
        if (input.value && allInputs[params[0]].value) {
          return `Just fill in this field and leave blank field ${allInputs[params[0]].name}`;
        }

        return `This field or field ${allInputs[params[0]].name} is required`;
      },
    },
  },
};

const validateRules = Object.assign({}, defaultRules, extendDemoRules);

const FormControlInputExample = () => (
  <div>
    <h2>Custom validation with control other validate input</h2>
    <p>The from require only 1 field can send to the server.
      If both field is empty then also can not submit to the server</p>
    <p>Problem is when field 1 is validating we also have to validate
      field 2 to check if that input is valid or not base on field 1 is changing value</p>
    <p>
      In complex validation we might also want to trigger validate on other
      field when value of the input change, or event change the value of other inputs.
    </p>
    <p>In the example field 2 will include with a promise validation</p>
    <Form
      validateLang="en"
      submitCallback={handlerSubmit}
      rules={validateRules}
      hasResetButton
    >
      <div>
        <Input
          label="Field 1"
          errorClassName="error-message"
          inputClassName="input"
          wrapClassName="input-group"
          type="text"
          name="field1"
          rule="requireCurrentOrOther,field2"
        />
        <br />

        <Input
          label="Field 2"
          errorClassName="error-message"
          inputClassName="input"
          wrapClassName="input-group"
          name="field2"
          type="text"
          rule="requireCurrentOrOther,field1"
          asyncRule="asyncTestTrue,2000"
        />
      </div>

      <br />

    </Form></div>
);

export default FormControlInputExample;
