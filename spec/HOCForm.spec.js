import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import cancelAblePromise from '../src/cancelablePromise';
import defaultRules from '../src/defaultRules';
import HOCForm from '../src/HOCForm';

/* global describe it expect jasmine beforeEach afterEach jest*/
console.log(jasmine.objectContaining);
describe('Test methods for HOCForm', () => {
  let wrapper,
    WrapperComponent,
    MockComponent,
    instance;

  beforeEach(() => {
    MockComponent = () => (<div>Fake Component</div>);

    const cancelAblePromiseDumbTrue = cancelAblePromise(new Promise((resolve) => {
      resolve(true);
    }));

    const cancelAblePromiseDumbFalse = cancelAblePromise(new Promise((resolve) => {
      resolve(false);
    }));

    const asyncRuleDumb = {
      asyncDumbTrue: {
        rule: () => cancelAblePromiseDumbTrue,
        message: {
          error: {
            en: 'dumb en',
            vi: 'dumb vi',
          },
        },
      },
      asyncDumbFalse: {
        rule: () => cancelAblePromiseDumbFalse,
        message: {
          error: {
            en: 'dumb en',
            vi: 'dumb vi',
          },
        },
      },
    };

    const rules = Object.assign({}, defaultRules, asyncRuleDumb);

    WrapperComponent = HOCForm(MockComponent);
    wrapper = shallow(
      <WrapperComponent
        validateLang="vi"
        rules={rules}
      />,
    );
    instance = wrapper.instance();
  });

  afterEach(() => {

  });

  describe('Test _checkHasError method', () => {
    it('Should return true if current check is true', () => {
      expect(instance._checkHasError(true, '', {})).toEqual(true);
    });

    it('Should return true if any inputs has error', () => {
      expect(instance._checkHasError(false, '', {
        input1: { error: true },
      })).toEqual(true);

      expect(instance._checkHasError(false, '', {
        input1: { error: false }, input3: { error: true }, input2: { error: false },
      })).toEqual(true);
    });

    it('Should return false if all the input and current check has not error', () => {
      expect(instance._checkHasError(false, '', {
        input1: { error: false }, input3: { error: false }, input2: { error: false },
      })).toEqual(false);
    });
  });

  describe('Test _register method', () => {
    it('Should set new input name and state', () => {
      instance._register('name', { error: true });
      expect(instance.state.inputs.name).toEqual({ error: true });
    });

    it('Should update input state', () => {
      instance._register('name', { error: true });
      instance._register('name', { error: false });
      expect(instance.state.inputs.name).toEqual({ error: false });
    });
  });

  describe('Test _formSubmitStagePrepare method', () => {
    it('Should return new state of the inputs', () => {
      const state = {
        inputs: {
          name: {
            value: '12345',
            rule: 'minLength,10',
          },
        },
      };

      const response = instance._formSubmitStagePrepare(state, defaultRules, {});

      expect(response).toEqual({
        newState: {
          hasError: true,
          inputs: {
            name: {
              validated: true,
              rule: 'minLength,10',
              value: '12345',
              dirty: true,
              error: true,
              errorMessage: {
                en: 'The value entered must be at least 10 characters.',
                vi: 'Ô này phải chứa ít nhất 10 ký tự',
              },
              errorRule: 'minLength,10',
              pending: false,
            },
          },
        },
        inputsAsyncRule: {},
      });
    });

    it('Should return new state of the inputs also cancel the promise that input hold', () => {
      const cancelAblePromiseDumb = cancelAblePromise(new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 5000);
      }));

      const asyncRule = {
        asyncTest: {
          rule: () => cancelAblePromiseDumb,
        },
      };

      const rules = Object.assign({}, defaultRules, asyncRule);

      const state = {
        submitted: true,
        inputs: {
          name: {
            asyncRule: 'asyncTest',
            value: '12345',
            rule: 'minLength,4',
          },
        },
      };

      const cancel = {
        name: {
          cancel() {
          },
        },
      };

      const calledCancel = spy(cancel.name, 'cancel');

      const response = instance._formSubmitStagePrepare(state, rules, cancel);

      expect(calledCancel.called).toEqual(true);

      expect(response).toEqual({
        newState: {
          hasError: false,
          submitted: true,
          inputs: {
            name: {
              validated: false,
              asyncRule: 'asyncTest',
              rule: 'minLength,4',
              value: '12345',
              dirty: true,
              error: false,
              errorMessage: '',
              errorRule: '',
              pending: true,
            },
          },
        },
        inputsAsyncRule: {
          name: {
            name: 'asyncTest',
            rule: cancelAblePromiseDumb,
            value: '12345',
          },
        },
      });
    });

    it('Should return new state of the inputs with out asyncRule also cancel the promise that input hold', () => {
      const cancelAblePromiseDumb = cancelAblePromise(new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 5000);
      }));

      const asyncRule = {
        asyncTest: {
          rule: () => cancelAblePromiseDumb,
        },
      };

      const rules = Object.assign({}, defaultRules, asyncRule);

      const state = {
        inputs: {
          name: {
            asyncRule: 'asyncTest',
            value: '12345',
            rule: 'minLength,10',
          },
        },
      };

      const cancel = {
        name: {
          cancel() {
          },
        },
      };

      const calledCancel = spy(cancel.name, 'cancel');

      const response = instance._formSubmitStagePrepare(state, rules, cancel);

      expect(calledCancel.called).toEqual(true);

      expect(response).toEqual({
        newState: {
          hasError: true,
          inputs: {
            name: {
              validated: true,
              asyncRule: 'asyncTest',
              value: '12345',
              dirty: true,
              error: true,
              errorMessage: {
                en: 'The value entered must be at least 10 characters.',
                vi: 'Ô này phải chứa ít nhất 10 ký tự',
              },
              errorRule: 'minLength,10',
              pending: false,
              rule: 'minLength,10',
            },
          },
        },
        inputsAsyncRule: {},
      });
    });
  });

  describe('Test method _checkInput', () => {
    it('Can validate an input with put async rule', () => {
      instance.setState({
        inputs: {
          name: {
            rule: 'minLength,10',
            error: false,
          },
        },
      });
      instance._checkInput('name', '12345');
      expect(instance.state.inputs.name.error).toEqual(true);


      instance.setState({
        inputs: {
          name: {
            rule: 'minLength,2',
            error: true,
          },
        },
      });
      instance._checkInput('name', '12345');
      expect(instance.state.inputs.name.error).toEqual(false);
    });

    it('Can validate input with async rule', () => {
      instance.setState({
        inputs: {
          nameNN: {
            asyncRule: 'asyncDumbTrue',
            rule: 'minLength,2',
            error: true,
          },
        },
      });

      instance._checkInput('nameNN', '12345');


      expect(instance.state.inputs.nameNN.error).toEqual(false);

      instance.setState({
        inputs: {
          nameMM: {
            asyncRule: 'asyncDumbFalse',
            rule: 'minLength,2',
            error: false,
          },
        },
      });
      instance._checkInput('nameMM', '12345');

      expect(instance.state.inputs.nameMM.error).toEqual(false);
    });
  });

  describe('Test method _formSubmitSumUp', () => {
    it('Should call doneCheck If all inputs with no pending and has error', () => {
      const doneSubmitCalled = spy(instance, '_doneSubmit');
      instance._formSubmitSumUp({
        hasError: true,
        inputs: {
          name: {
            pending: false,
          },
          nameNN: {
            pending: false,
          },
        },
      });
      expect(doneSubmitCalled.called).toEqual(true);
    });

    it('Should call submitCallback If all inputs with no pending and has no error', () => {
      const doneSubmitCalled = spy(instance, '_submitCallback');
      instance._formSubmitSumUp({
        hasError: false,
        inputs: {
          name: {
            pending: false,
          },
          nameNN: {
            pending: false,
          },
        },
      });
      expect(doneSubmitCalled.called).toEqual(true);
    });

    it('Should do nothing when another input state is pending', () => {
      const doneSubmitCalled = spy(instance, '_submitCallback');
      const doneSubmitCalled2 = spy(instance, '_doneSubmit');
      instance._formSubmitSumUp({
        hasError: false,
        inputs: {
          name: {
            pending: false,
          },
          nameNN: {
            pending: true,
          },
        },
      });
      expect(doneSubmitCalled.called).toEqual(false);
      expect(doneSubmitCalled2.called).toEqual(false);
    });
  });

  describe('Test method _submitCallback', () => {
    it('Should call the callback', () => {
      const cb = {
        cb() {
        },
      };

      const spyCb = spy(cb, 'cb');

      instance._submitCallback({ a: 1 }, cb.cb);

      expect(spyCb.calledWith({ a: 1 }, instance._doneSubmit)).toEqual(true);
    });
  });

  describe('Test method _reset', () => {
    it('Can reset the state of the input', () => {
      instance.setState({
        inputs: {
          name: {
            errorMessage: 'asasa',
            dirty: true,
            validated: true,
            pending: true,
            value: '121',
            rule: 'minLength,10',
            error: true,
          },
        },
      });

      instance._reset();

      expect(instance.state.inputs.name).toEqual(jasmine.objectContaining({
        errorMessage: '',
        dirty: false,
        validated: false,
        pending: false,
        value: '',
        error: false,
      }));
    });

    it('Can reset the state of the input with default value', () => {
      instance.setState({
        inputs: {
          name: {
            defaultValue: '123',
            dirty: true,
            validated: true,
            pending: true,
            value: '121',
            rule: 'minLength,10',
            error: true,
          },
        },
      });

      instance._reset();

      expect(instance.state.inputs.name).toEqual(jasmine.objectContaining({
        dirty: false,
        validated: false,
        pending: false,
        value: '123',
        error: false,
      }));
    });
  });
});


describe('Test render for HOCForm', () => {
  it('Should wrap the mock component at first', () => {
    const MockComponent = () => (<div>Fake Component</div>);

    const Wrap = HOCForm(MockComponent);

    const wrapper = shallow(
      <Wrap
        validateLang="vi"
        rules={defaultRules}
      />,
    );

    expect(wrapper.first().is(MockComponent)).toBeTruthy();
  });
});
