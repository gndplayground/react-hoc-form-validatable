import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import defaultRules from '../src/defaultRules';
import cancelAblePromise from '../src/cancelablePromise';
import Form from '../dev/components/Form';
import Input from '../dev/components/Input';

/* global describe it expect jasmine beforeEach afterEach */
describe('Test render custom error message', () => {
  let FormTest;
  let FromTestRender;
  let handlerSubmit;
  beforeEach(() => {
    handlerSubmit = spy();
    const extendDemoRules = {
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

    FormTest = () => (<Form
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
          customErrorMessages={{
            notEmpty: 'notEmpty userName',
            minLength: 'minLength {0} userName',
          }}
        />
        <Input
          label="Your email"
          errorClassName="error-message"
          inputClassName="input"
          wrapClassName="input-group"
          type="email"
          name="email"
          rule="notEmpty|isEmail"
          asyncRule="asyncTestFalse,10"
          customErrorMessages={{
            asyncTestFalse: 'custom message {0}',
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
          asyncRule="asyncTestFalse,10"
          customErrorMessages={{
            asyncTestFalse: {
              en: 'custom message en {0}',
              vi: 'custom message vi {0}',
            },
            notEmpty: {
              en: 'notEmpty password en',
              vi: 'notEmpty password vi',
            },
            minLength: {
              en: 'minLength {0} password en',
              vi: 'minLength {0} password vi',
            },
          }}
        />
      </div>

      <br />

    </Form>
    );

    FromTestRender = mount(
      <FormTest />,
    );
  });

  describe('Test show custom error message with sync rule', () => {
    it('Should pass prop custom error message type string', () => {
      const userNameInput = FromTestRender.find('input[name="userName"]');
      userNameInput.simulate('change', { target: { value: '', name: 'userName' } });
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '',
        errorMessage: 'notEmpty userName',
      }));
    });

    it('Should pass prop custom error message type object', () => {
      const passwordInput = FromTestRender.find('input[name="password"]');
      passwordInput.simulate('change', { target: { value: '', name: 'password' } });
      expect(FromTestRender.find('Input').getElements()[2].props).toEqual(jasmine.objectContaining({
        value: '',
        errorMessage: {
          en: 'notEmpty password en',
          vi: 'notEmpty password vi',
        },
      }));
    });

    it('Should pass prop custom error message type string with format', () => {
      const userNameInput = FromTestRender.find('input[name="userName"]');
      userNameInput.simulate('change', { target: { value: '123', name: 'userName' } });
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '123',
        errorMessage: 'minLength 4 userName',
      }));
    });

    it('Should pass prop custom error message type object with format', () => {
      const passwordInput = FromTestRender.find('input[name="password"]');
      passwordInput.simulate('change', { target: { value: '1234', name: 'password' } });
      expect(FromTestRender.find('Input').getElements()[2].props).toEqual(jasmine.objectContaining({
        value: '1234',
        errorMessage: {
          en: 'minLength 6 password en',
          vi: 'minLength 6 password vi',
        },
      }));
    });
  });

  describe('Test show custom error message with async rule', () => {
    it('Should return custom error mesaage type object formatted', (done) => {
      const email = FromTestRender.find('input[name="email"]');
      email.simulate('change', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });

      setTimeout(() => {
        try {
          FromTestRender.update();
          expect(FromTestRender.find('Input').getElements()[1].props).toEqual(jasmine.objectContaining({
            value: 'giang.nguyen.dev@gmail.com',
            errorMessage: 'custom message 10',
          }));
          done();
        } catch (e) {
          console.log(e);
        }
      }, 50);
    });

    it('Should return custom error message type object formatted', (done) => {
      const password = FromTestRender.find('input[name="password"]');
      password.simulate('change', { target: { value: '123456', name: 'password' } });

      setTimeout(() => {
        try {
          FromTestRender.update();
          expect(FromTestRender.find('Input').getElements()[2].props).toEqual(jasmine.objectContaining({
            value: '123456',
            errorMessage: {
              en: 'custom message en 10',
              vi: 'custom message vi 10',
            },
          }));
          done();
        } catch (e) {
          console.log(e);
        }
      }, 50);
    });
  });
});
