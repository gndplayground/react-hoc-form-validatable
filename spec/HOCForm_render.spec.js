import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import defaultRules from '../src/defaultRules';
import Form from '../dev/components/Form';
import Input from '../dev/components/Input';


/* global describe it expect jasmine beforeEach afterEach */


describe('Test render validate form with no async rules', () => {
  let FormTest;
  let FromTestRender;
  let handlerSubmit;
  beforeEach(() => {
    handlerSubmit = spy();
    FormTest = React.createClass({
      render() {
        return (
          <Form
            submitCallback={handlerSubmit}
            validateLang="en"
            rules={defaultRules}
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
              />
              <Input
                label="Your email"
                errorClassName="error-message"
                inputClassName="input"
                wrapClassName="input-group"
                type="email"
                name="email"
                rule="notEmpty|isEmail"
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

          </Form>);
      },
    });

    FromTestRender = mount(
      <FormTest />,
    );
  });

  describe('Test input on blur', () => {
    it('Should validated and return new props when input has error', () => {
      const userName = FromTestRender.find('input[name="userName"]');
      userName.simulate('blur', { target: { value: '12', name: 'userName' } });
      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        value: '12',
        error: true,
        dirty: true,
        validated: true,
        errorMessage:
        {
          en: 'This field length must be at least 4 characters',
          vi: 'Ô này phải chứa ít nhất 4 ký tự',
        },
      }));
    });

    it('Should validated and return new props when input has no error', () => {
      const email = FromTestRender.find('input[name="email"]');
      email.simulate('blur', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });
      expect(FromTestRender.find('Input').nodes[1].props).toEqual(jasmine.objectContaining({
        value: 'giang.nguyen.dev@gmail.com',
        error: false,
        dirty: true,
        validated: true,
        errorMessage: '',
      }));
    });
  });

  describe('Test input on key up (value changes)', () => {
    it('Should validated and return new props when input has error', () => {
      const userName = FromTestRender.find('input[name="userName"]');
      userName.simulate('change', { target: { value: '12', name: 'userName' } });
      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        value: '12',
        error: true,
        dirty: true,
        validated: true,
        errorMessage:
        {
          en: 'This field length must be at least 4 characters',
          vi: 'Ô này phải chứa ít nhất 4 ký tự',
        },
      }));
    });

    it('Should validated and return new props when input has no error', () => {
      const email = FromTestRender.find('input[name="email"]');
      email.simulate('change', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });
      expect(FromTestRender.find('Input').nodes[1].props).toEqual(jasmine.objectContaining({
        value: 'giang.nguyen.dev@gmail.com',
        error: false,
        dirty: true,
        validated: true,
        errorMessage: '',
      }));
    });
  });

  describe('Test form submit', () => {
    it('Should validted all input and return new props for each input', () => {
      FromTestRender.find('form').simulate('submit');
      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: true,
        dirty: true,
        validated: true,
      }));
      expect(FromTestRender.find('Input').nodes[1].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: true,
        dirty: true,
        validated: true,
      }));
      expect(FromTestRender.find('Input').nodes[2].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: true,
        dirty: true,
        validated: true,
      }));

      expect(handlerSubmit.called).toEqual(false);
    });

    it('Should validated all input and return new props for each input has not validated', () => {
      const email = FromTestRender.find('input[name="email"]');

      email.simulate('change', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });

      FromTestRender.find('form').simulate('submit');

      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: true,
        dirty: true,
        validated: true,
      }));
      expect(FromTestRender.find('Input').nodes[1].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: false,
        dirty: true,
        validated: true,
      }));
      expect(FromTestRender.find('Input').nodes[2].props).toEqual(jasmine.objectContaining({
        submitted: false,
        error: true,
        dirty: true,
        validated: true,
      }));

      expect(handlerSubmit.called).toEqual(false);
    });

    it('Should validated all input and return new props for each input has not validated2', () => {
      const email = FromTestRender.find('input[name="email"]');
      const userName = FromTestRender.find('input[name="userName"]');
      const password = FromTestRender.find('input[name="password"]');

      email.simulate('change', { target: { value: 'giang.nguyen.dev@gmail.com', name: 'email' } });
      userName.simulate('change', { target: { value: 'abcd121121', name: 'userName' } });
      password.simulate('change', { target: { value: '1234567', name: 'password' } });

      FromTestRender.find('form').simulate('submit');

      expect(FromTestRender.find('Input').nodes[0].props).toEqual(jasmine.objectContaining({
        submitted: true,
        error: false,
        dirty: true,
        validated: true,
      }));

      expect(FromTestRender.find('Input').nodes[1].props).toEqual(jasmine.objectContaining({
        submitted: true,
        error: false,
        dirty: true,
        validated: true,
      }));

      expect(FromTestRender.find('Input').nodes[2].props).toEqual(jasmine.objectContaining({
        submitted: true,
        error: false,
        dirty: true,
        validated: true,
      }));

      expect(handlerSubmit.called).toEqual(true);
    });
  });
});

