import React from 'react';
import { mount } from 'enzyme';
import defaultRules from '../src/defaultRules';
import cancelAblePromise from '../src/cancelablePromise';
import Form from '../dev/components/Form';
import Input from '../dev/components/Input';

/* global describe it expect jasmine beforeEach afterEach */

describe('Test render validate form with async rules always return true', () => {
  let FormTest;
  let FromTestRender;
  let handlerSubmit;

  beforeEach(() => {
    const extendDemoRules = {
      asyncTestFalse: {
        rule: () => cancelAblePromise(new Promise((resolve) => {
          setTimeout(() => {
            resolve(false);
          }, 10);
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

    FormTest = () => (
      <Form
        submitCallback={handlerSubmit}
        validateLang="en"
        rules={validateRules}
      >
        <div>
          <Input
            optional
            id="foo"
            label="Choose your user name"
            type="text"
            name="foo"
            rule="minLength,4"
            asyncRule="asyncTestFalse,10"
          />
        </div>

        <br />

      </Form>);

    FromTestRender = mount(
      <FormTest />,
    );
  });

  describe('Test input on key up (value changes)', () => {
    it('Should skip asycn rule and other rules when input is optional', () => {
      const fooInput = FromTestRender.find('input[name="foo"]');
      fooInput.simulate('change', { target: { value: '', name: 'foo' } });
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '',
        error: false,
        dirty: true,
        validated: true,
        pending: false,
      }));
      FromTestRender.find('form').simulate('submit');
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '',
        error: false,
        dirty: true,
        validated: true,
        pending: false,
      }));
    });

    it('Should validate input when not empty', (done) => {
      const userName = FromTestRender.find('input[name="foo"]');
      userName.simulate('change', { target: { value: '123', name: 'foo' } });
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '123',
        error: true,
        dirty: true,
        validated: true,
        submitted: false,
        errorMessage: 'The value entered must be at least 4 characters.',
      }));
      userName.simulate('change', { target: { value: '1245', name: 'foo' } });

      FromTestRender.find('form').simulate('submit');

      setTimeout(() => {
        try {
          FromTestRender.update();
          expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
            value: '1245',
            error: true,
            dirty: true,
            validated: true,
            pending: false,
          }));
          done();
        } catch (e) {
          console.error(e);
        }
      }, 100);
    });
  });
});

