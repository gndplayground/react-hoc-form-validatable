import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import defaultRules from '../src/defaultRules';
import Form from '../dev/components/Form';
import Input from '../dev/components/Input';


/* global describe it expect jasmine beforeEach afterEach */


describe('Test render validate form with optional input and no async rules', () => {
  let FormTest;
  let FromTestRender;
  let handlerSubmit;
  beforeEach(() => {
    handlerSubmit = spy();
    const extendDemoRules = {
      testCalculatedMessage: {
        rule: (value, params, input, allInputs) => {
          if (parseInt(input.value, 10) !== 1 || allInputs.email.value !== 'abc@abc.com') {
            return true;
          }
          return false;
        },

        message: {
          error: (value, params, input, allInputs) => ({
            en: `en ${value} ${params[0]} ${input.value} ${allInputs.email.value}`,
            vi: `vi ${value} ${params[0]} ${input.value} ${allInputs.email.value}`,
          }),
        },
      },
    };

    const validateRules = Object.assign({}, defaultRules, extendDemoRules);
    FormTest = () => (
      <Form
        submitCallback={handlerSubmit}
        validateLang="en"
        rules={validateRules}
      >
        <div>
          <Input
            optional
            id="bar"
            label="bar"
            type="text"
            name="bar"
            rule="minLength,4"
          />
          <Input
            id="foo"
            label="foo"
            type="text"
            name="foo"
            rule="notEmpty|minLength,4"
          />
        </div>

        <br />

      </Form>);

    FromTestRender = mount(
      <FormTest />,
    );
  });

  describe('Test form with optional input', () => {
    it('Should bar input is valid when submit form with empty value', () => {
      FromTestRender.find('form').simulate('submit');
      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: false,
        dirty: true,
        validated: true,
      }));
      expect(FromTestRender.find('Input').nodes[1].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: true,
        dirty: true,
        validated: true,
      }));

      expect(handlerSubmit.called).toEqual(false);
    });

    it('Should change invalid value and empty input cause optional input is valid', () => {
      const barInput = FromTestRender.find('input[name="bar"]');
      barInput.simulate('change', { target: { value: '12', name: 'bar' } });
      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        value: '12',
        error: true,
        dirty: true,
        validated: true,
        errorMessage:
        {
          en: 'The value entered must be at least 4 characters.',
          vi: 'Ô này phải chứa ít nhất 4 ký tự',
        },
      }));
      barInput.simulate('change', { target: { value: '', name: 'bar' } });
      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        value: '',
        error: false,
        dirty: true,
        validated: true,
        errorMessage: '',
      }));
    });
  });
});

