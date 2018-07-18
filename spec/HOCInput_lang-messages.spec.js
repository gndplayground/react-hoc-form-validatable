import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import defaultRules from '../src/defaultRules';
import Form from './components/Form';
import Input from './components/Input';

/* global describe it expect jasmine beforeEach afterEach */
describe('Test render with error lang', () => {
  let FormTest;
  let FromTestRender;
  let handlerSubmit;
  beforeEach(() => {
    handlerSubmit = spy();
    const extendDemoRules = {
      minLengthVi: {
        rule(value, param) {
          return value.length >= param[0];
        },

        message: {
          error: {
            en: 'The value entered must be at least {0} characters.',
            vi: 'Ô phải chứa ít nhất {0} ký tự',
          },
        },
      },
      asyncTestFalse: {
        rule: (value, params) => new Promise((resolve) => {
          setTimeout(() => { resolve(false); }, parseInt(params[0], 10));
        }),

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
        validateLang="vi"
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
            rule="notEmpty|minLengthVi,4"
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

  describe('Test error lang with with sync rule', () => {
    it('Should pass prop custom error message type string', () => {
      const userNameInput = FromTestRender.find('input[name="userName"]');
      userNameInput.simulate('change', { target: { value: '2', name: 'userName' } });
      expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
        value: '2',
        lang: 'vi',
        errorMessage: {
          en: 'The value entered must be at least 4 characters.',
          vi: 'Ô phải chứa ít nhất 4 ký tự',
        },
      }));
    });

    it('Should pass prop custom error message type object', () => {
      const passwordInput = FromTestRender.find('input[name="password"]');
      passwordInput.simulate('change', { target: { value: '', name: 'password' } });
      expect(FromTestRender.find('Input').getElements()[2].props).toEqual(jasmine.objectContaining({
        value: '',
        lang: 'vi',
        errorMessage: {
          en: 'notEmpty password en',
          vi: 'notEmpty password vi',
        },
      }));
    });
  });

  describe('Test error lang with with  async rule', () => {
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
