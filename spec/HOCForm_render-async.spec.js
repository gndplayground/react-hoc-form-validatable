import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import defaultRules from '../src/defaultRules';
import cancelAblePromise from '../src/cancelablePromise';
import Form from '../dev/components/Form';
import Input from '../dev/components/Input';

/* global describe it expect jasmine beforeEach afterEach */

describe('Test render validate form with async rules always return true', () => {
  let FormTest;
  let FromTestRender;
  let handlerSubmit;
  const cancel = cancelAblePromise(new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 10);
  }));

  let spyCancelAblePromise;


  afterEach(() => {
    cancel.cancel.restore();
  });

  beforeEach(() => {
    handlerSubmit = spy();
    spyCancelAblePromise = spy(cancel, 'cancel');
    const extendDemoRules = {
      asyncTestTrue: {
        rule: () => cancel,

        message: {
          error: {
            en: 'en async test1',
            vi: 'vi async test1',
          },
        },
      },

      asyncTestCalculatedMessage: {
        rule: (value, params, input, allInputs) => cancelAblePromise(new Promise((resolve) => {
          setTimeout(() => {
            if (parseInt(input.value, 10) !== 1 || allInputs.email.value !== 'abc@abc.com') {
              resolve(true);
            } else {
              resolve(false);
            }
          }, 10);
        })),

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
            id="foo"
            label="Choose your user name"
            errorClassName="error-message"
            wrapClassName="input-group"
            type="text"
            name="userName"
            rule="notEmpty|minLength,4"
            asyncRule="asyncTestTrue,10"
          />
          <Input
            label="Your email"
            errorClassName="error-message"
            inputClassName="input"
            wrapClassName="input-group"
            type="email"
            name="email"
            rule="notEmpty|isEmail"
            asyncRule="asyncTestTrue,10"
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

          <Input
            label="Test"
            errorClassName="error-message"
            inputClassName="input"
            wrapClassName="input-group"
            type="test"
            name="test"
            rule="notEmpty"
            asyncRule="asyncTestCalculatedMessage,abc"
          />
        </div>

        <br />

      </Form>);

    FromTestRender = mount(
      <FormTest />,
    );
  });

  describe('Test input on key up (value changes)', () => {
    it('Should validated sync rule and return new props with pending state when input has no error', () => {
      const userName = FromTestRender.find('input[name="userName"]');
      userName.simulate('change', { target: { value: '12345', name: 'userName' } });
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '12345',
        error: false,
        dirty: true,
        validated: false,
        pending: true,
      }));
    });

    it('Should have accessable to current input state and all inputs state in rule function', (done) => {
      const emailInput = FromTestRender.find('input[name="email"]');
      emailInput.simulate('change', { target: { value: 'abc@abc.com', name: 'email' } });
      const calcInput = FromTestRender.find('input[name="test"]');
      calcInput.simulate('change', { target: { value: '1', name: 'test' } });
      setTimeout(() => {
        try {
          FromTestRender.update();
          expect(FromTestRender.find('Input').getElements()[3].props).toEqual(jasmine.objectContaining({
            value: '1',
            error: true,
            dirty: true,
            validated: true,
            pending: false,
            errorMessage: {
              en: 'en 1 abc 1 abc@abc.com',
              vi: 'vi 1 abc 1 abc@abc.com',
            },
          }));
          done();
        } catch (e) {
          console.log(e);
        }
      }, 1000);
    });

    it('Should validate input success after done promise', (done) => {
      const userName = FromTestRender.find('input[name="userName"]');
      userName.simulate('change', { target: { value: '12345', name: 'userName' } });
      setTimeout(() => {
        try {
          FromTestRender.update();
          expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
            value: '12345',
            error: false,
            dirty: true,
            validated: true,
            pending: false,
          }));
          done();
        } catch (e) {
          console.log(e);
        }
      }, 50);
    });

    it('Should cancel the async rules when unmount the form', () => {
      const userName = FromTestRender.find('input[name="userName"]');
      const email = FromTestRender.find('input[name="email"]');
      userName.simulate('change', { target: { value: '12345', name: 'userName' } });
      email.simulate('change', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });

      FromTestRender.unmount();

      expect(spyCancelAblePromise.callCount).toEqual(2);
    });
  });

  describe('Test form submit', () => {
    it('Should cancel the async rules when unmount the form', () => {
      const userName = FromTestRender.find('input[name="userName"]');
      const email = FromTestRender.find('input[name="email"]');
      userName.simulate('change', { target: { value: '12345', name: 'userName' } });
      email.simulate('change', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });
      FromTestRender.find('form').simulate('submit');

      FromTestRender.unmount();


      expect(spyCancelAblePromise.callCount).toEqual(4);
      expect(handlerSubmit.called).toEqual(false);
    });

    it('Should validated all sync rule input, set pending state for async rule input and return new props for each input', () => {
      const userName = FromTestRender.find('input[name="userName"]');
      userName.simulate('change', { target: { value: '12345', name: 'userName' } });
      FromTestRender.find('form').simulate('submit');
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '12345',
        error: false,
        dirty: true,
        validated: false,
        pending: true,
      }));
      expect(FromTestRender.find('Input').getElements()[1].props).toEqual(jasmine.objectContaining({
        error: true,
        dirty: true,
        validated: true,
      }));
      expect(FromTestRender.find('Input').getElements()[2].props).toEqual(jasmine.objectContaining({
        error: true,
        dirty: true,
        validated: true,
      }));

      expect(handlerSubmit.called).toEqual(false);
    });

    it('Should validated all input after  async rules and return new props for each input. Also call submit callback', (done) => {
      const userName = FromTestRender.find('input[name="userName"]');
      const email = FromTestRender.find('input[name="email"]');
      const password = FromTestRender.find('input[name="password"]');
      const test = FromTestRender.find('input[name="test"]');
      userName.simulate('change', { target: { value: '12345', name: 'userName' } });
      email.simulate('change', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });
      password.simulate('change', { target: { value: '123456', name: 'password' } });
      test.simulate('change', { target: { value: '5', name: 'test' } });

      FromTestRender.find('form').simulate('submit');

      setTimeout(() => {
        try {
          FromTestRender.update();
          expect(FromTestRender.find('Input').getElements()[3].props).toEqual(jasmine.objectContaining({
            value: '5',
            error: false,
            dirty: true,
            validated: true,
            errorMessage: '',
            pending: false,
          }));
          done();
        } catch (e) {
          console.log(e);
        }
      }, 100);
    });

    it('Should access able to current input state and all input state when called submit', (done) => {
      const userName = FromTestRender.find('input[name="userName"]');
      const password = FromTestRender.find('input[name="password"]');
      userName.simulate('change', { target: { value: '12345', name: 'userName' } });
      password.simulate('change', { target: { value: '123456', name: 'password' } });
      const email = FromTestRender.find('input[name="email"]');
      const test = FromTestRender.find('input[name="test"]');
      email.simulate('change', { target: { value: 'abc@abc.com', name: 'email' } });
      test.simulate('change', { target: { value: '1', name: 'test' } });

      try {
        FromTestRender.find('form').simulate('submit');

        setTimeout(() => {
          try {
            FromTestRender.update();
            expect(FromTestRender.find('Input').getElements()[3].props).toEqual(jasmine.objectContaining({
              error: true,
              dirty: true,
              validated: true,
              errorMessage: {
                en: 'en 1 abc 1 abc@abc.com',
                vi: 'vi 1 abc 1 abc@abc.com',
              },
            }));
            done();
          } catch (e) {
            console.log(e);
          }
        }, 100);
      } catch (e) {
        console.log(e);
      }
    });
  });
});

