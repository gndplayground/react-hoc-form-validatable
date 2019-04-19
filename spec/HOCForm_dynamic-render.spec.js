import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import update from 'immutability-helper';
import defaultRules from '../src/defaultRules';
import Form from './components/Form';
import Input from './components/Input';

/* global describe it expect jasmine beforeEach afterEach */

describe('Test form with dynamic inputs', () => {
  let FromTestRender;
  let handlerSubmit;
  let instance;
  let HOCForm;
  let onUnRegistered;
  let onRegistered;

  beforeEach(() => {
    handlerSubmit = spy();
    onUnRegistered = spy();
    onRegistered = spy();

    class DynamicExample extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          inputs: [
            {
              id: Math.random(),
              label: 'Choose your user name',
              errorClassName: 'error-message',
              wrapClassName: 'input-group',
              type: 'text',
              name: 'userName',
              defaultValue: '1234',
              rule: 'notEmpty|minLength,4',
            },
          ],
        };
      }

      addInput = (name, valid) => {
        this.setState(
          (state) => {
            const id = Math.random();
            return update(state, {
              inputs: {
                $push: [{
                  id,
                  label: `Choose your user name (${id})`,
                  errorClassName: 'error-message',
                  wrapClassName: 'input-group',
                  type: 'text',
                  name,
                  defaultValue: valid ? '1234' : '123',
                  rule: 'notEmpty|minLength,4',
                }],
              },
            });
          },
        );
      };

      removeInput = () => {
        this.setState(
          (state) => {
            const newInputs = state.inputs.splice(0);
            newInputs.pop();
            return update(state, {
              inputs: {
                $set: newInputs,
              },
            });
          },
        );
      };

      render() {
        return (

          <Form
            ref={(form) => { this.form = form; }}
            validateLang="en"
            submitCallback={handlerSubmit}
            rules={defaultRules}
            hasResetButton
          >

            {
              this.state.inputs.map(test => <Input onUnRegistered={onUnRegistered} onRegistered={onRegistered} {...test} key={test.id} />)
            }

          </Form>
        );
      }
    }

    FromTestRender = mount(
      <DynamicExample />,
    );
    instance = FromTestRender.instance();
    HOCForm = instance.form;
  });


  describe('Test dynamic register and un register input', () => {
    it('Should register new input success', () => {
      instance.addInput('newAdded');
      expect(onRegistered.called).toEqual(true);
      expect(HOCForm.state.inputs.hasOwnProperty('newAdded')).toEqual(true);
    });

    it('Should un register new input success', () => {
      instance.addInput('newAdded');
      expect(HOCForm.state.inputs.hasOwnProperty('newAdded')).toEqual(true);
      instance.removeInput();
      expect(onUnRegistered.called).toEqual(true);
      expect(HOCForm.state.inputs.hasOwnProperty('newAdded')).toEqual(false);
    });
  });

  describe('Test submit the form after added or removed input', () => {
    it('Should submit the form successfully after added a input', () => {
      instance.addInput('newAdded', true);
      FromTestRender.find('form').simulate('submit');
      expect(handlerSubmit.called).toEqual(true);
    });

    it('Should submit the form successfully after remove a input', () => {
      instance.removeInput();
      FromTestRender.find('form').simulate('submit');
      expect(handlerSubmit.called).toEqual(true);
    });

    it('Should not submit the form successfully after added a input because has error', () => {
      instance.addInput('newAdded');
      FromTestRender.find('form').simulate('submit');
      expect(HOCForm.state.hasError).toEqual(true);
      expect(handlerSubmit.called).toEqual(false);
    });
  });
});
