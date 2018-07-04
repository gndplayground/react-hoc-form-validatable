import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import cloneDeep from 'lodash.clonedeep';
import { validate, getRuleNameAndParams, formatMessage } from './validateHelpers';


const HOCForm = Component =>

  class HOCFormValidateAble extends React.Component {
    /**
     * Component prop types
     * @type {Object}
     * @property {Object} validateLang - Language for the error messages
     * @property {Object} rules - Rules object
     * @property {function} submitCallback - Callback when form submit success
     * @property {function} errorCallback - Callback when form submit with error
     */
    static propTypes = {
      validateLang: PropTypes.string.isRequired,
      rules: PropTypes.object.isRequired,
      submitCallback: PropTypes.func,
      errorCallback: PropTypes.func,
    };

    /**
     * Component context types
     * @type {Object}
     * @property {String} validateLang - Language for the error messages
     * @property {Function} validateInputOnChange - Handler event change input value
     * @property {Object} validateInputs - State of the inputs in the form
     * @property {Function} validateRegister - Register the input and change state of the input
     * @property {Boolean} validateSubmitted - The form is submitting
     */
    static childContextTypes = {
      validateLang: PropTypes.string.isRequired,
      validateInputOnChange: PropTypes.func.isRequired,
      validateInputs: PropTypes.object,
      validateRegister: PropTypes.func.isRequired,
      validateUnRegister: PropTypes.func.isRequired,
      validateSubmitted: PropTypes.bool,
    };

    /**
     * Component map contexts
     * @returns {Object}
     */
    getChildContext() {
      return {
        validateLang: this.props.validateLang,
        validateInputOnChange: this._checkInput,
        validateInputs: this.state.inputs,
        validateRegister: this._register,
        validateUnRegister: this._unRegister,
        validateSubmitted: this.state.submitted,
      };
    }

    /**
     * Constructor
     * @param {Object} props
     */
    constructor(props) {
      super(props);

      /**
       * Component state
       * @type {Object}
       * @property {Boolean} hasError - Check if any inputs have error state
       * @property {Boolean} submitted - Check if the form is submitted
       * @property {Object} inputs - Hold inputs data
       */
      this.state = {
        hasError: false,
        submitted: false,
        inputs: {},
      };

      // Hold async check so we can easy cancel later
      this.onCheckInputPromise = {};
    }

    /**
     * React life cycle
     */
    componentWillUnmount() {
      this._isUnmounted = true;
      this._clearPromises();
    }

    /**
     * Check if in input states has validate errors
     * @param {Boolean} currentCheck - If current input has error return immediately
     * @param {String} skip - Skip input
     * @param {Object} inputs - Inputs state
     * @returns {Boolean}
     * @private
     */
    _checkHasError = (currentCheck, skip, inputs) => {
      if (currentCheck) return currentCheck;
      for (const input in inputs) {
        if (input !== skip && inputs[input].error === true) {
          return true;
        }
      }
      return false;
    };

    _unRegister = (input) => {
      if (!this._isUnmounted) {
        this.setState((state) => {
          const newState = cloneDeep(state.inputs);
          if (newState[input]) {
            delete newState[input];
          }
          return {
            inputs: newState,
          };
        });
      }
    };

    /**
     * Register or update input state.
     * @param {String} input - Input name
     * @param {Object} dataInput
     * @private
     */
    _register = (input, dataInput) => {
      if (!this._isUnmounted) {
        this.setState((state) => {
          const hasError = typeof dataInput.error === 'undefined' ? state.hasError : this._checkHasError(dataInput.error, input, state.inputs);
          const inputs = Object.assign(state.inputs, {
            [input]: update(state.inputs[input] || {}, { $merge: dataInput }),
          });
          return {
            hasError,
            inputs,
          };
        });
      }
    };

    /**
     * Form control method check input pass to custom validation
     * @param {Object} inputStateTrigger - current state of input that trigger method
     * @param {String} name - name of the input need to set value and validate
     * @param {*} value value - value of the input need to set value and validate
     * @param {FileList} files - FileList of the input need to validate
     * @private
     */
    _formControlCheckInput = (inputStateTrigger, name, value, files) => {
      this._checkInput(name, value, files, true, inputStateTrigger);
    };

    /**
     * Handle input onchange value
     * @param {String} name
     * @param {*} value
     * @param {FileList} files
     * @param {Boolean} isTriggerByFormControl
     * @param {Object} inputStateTrigger
     * @private
     */
    _checkInput = (name, value, files, isTriggerByFormControl, inputStateTrigger) => {
      const newInputState = update(this.state.inputs[name], {
        value: { $set: value || '' },
        files: { $set: files || null },
      });

      const prepareUpdateInputsState = {
        [name]: { $set: newInputState },
      };

      if (isTriggerByFormControl) {
        prepareUpdateInputsState[inputStateTrigger.name] = { $set: inputStateTrigger };
      }

      const currentInputsState = update(this.state.inputs, prepareUpdateInputsState);


      const response = validate(
        newInputState,
        this.props.rules,
        currentInputsState,
        {
          isControlledValidate: isTriggerByFormControl,
          checkInput: this._formControlCheckInput,
        },
      );

      // Remove any promise left when typing too fast
      if (!response.check && this.onCheckInputPromise[name]) {
        this.onCheckInputPromise[name].cancel();
      }

      if (response.check
        && newInputState.asyncRule
        && (!newInputState.optional || (newInputState.optional && newInputState.value))
      ) {
        this._register(name, {
          pending: true,
          validated: false,
          dirty: true,
          value,
          files,
          errorRule: response.errorRule,
          error: !response.check,
          errorMessage: response.message,
        });

        const ruleNameAndParams = getRuleNameAndParams(this.state.inputs[name].asyncRule);

        // Cancel async validate of the input
        if (this.onCheckInputPromise[name]) {
          this.onCheckInputPromise[name].cancel();
        }

        this.onCheckInputPromise[name] = this.props.rules[ruleNameAndParams.ruleName].rule(
          value,
          ruleNameAndParams.params,
          newInputState,
          currentInputsState,
        );

        this.onCheckInputPromise[name].then((result) => {
          this._register(name, {
            validated: true,
            value,
            files,
            dirty: true,
            error: !result,
            errorRule: !result ? this.state.inputs[name].asyncRule : '',
            errorMessage: result ? '' : formatMessage(
              this.props.rules[ruleNameAndParams.ruleName].message.error,
              ruleNameAndParams.params,
              newInputState,
              currentInputsState,
            ),
            pending: false,
          });
        }).catch((error) => {
          if (!error.isCanceled) console.error(error);
        });
      } else {
        this._register(name, {
          validated: true,
          dirty: true,
          pending: false,
          files,
          value,
          error: !response.check,
          errorMessage: response.message,
          errorRule: response.errorRule,
        });
      }
    };

    /**
     * Validate sync rules and return new states, and async rules
     * @param {Object} state
     * @param {Object} rules
     * @param {Object} inputsPromise
     * @returns {{newState: *, inputsAsyncRule: {}}}
     * @private
     */
    _formSubmitStagePrepare = (state, rules, inputsPromise, isControlledValidate) => {
      let newState = cloneDeep(state);
      const inputsAsyncRule = {};
      for (const input in newState.inputs) {
        // Cancel current promise of the input
        if (inputsPromise[input]) {
          inputsPromise[input].cancel();
        }
        if (newState.inputs[input].pending || !newState.inputs[input].validated) {
          const response = validate(
            newState.inputs[input],
            rules,
            newState.inputs,
            {
              isControlledValidate,
              checkInput: this._formControlCheckInput,
            },
          );
          if (response.check
              && newState.inputs[input].asyncRule
              && (
                  !newState.inputs[input].optional
                  || (newState.inputs[input] && newState.inputs[input].value)
                )
          ) {
            const ruleNameAndParams = getRuleNameAndParams(newState.inputs[input].asyncRule);
            inputsAsyncRule[input] = {
              name: newState.inputs[input].asyncRule,
              value: newState.inputs[input].value,
              rule: rules[ruleNameAndParams.ruleName].rule(
                  newState.inputs[input].value,
                  ruleNameAndParams.params,
                  newState.inputs[input],
                  newState.inputs,
                ),
            };
          }

          const hasError = this._checkHasError(!response.check, input, newState.inputs);

          newState = update(newState, {
            hasError: { $set: hasError },
            inputs: {
              [input]: {
                validated: { $set: Boolean(!inputsAsyncRule[input]) },
                pending: { $set: Boolean(inputsAsyncRule[input]) },
                dirty: { $set: true },
                error: { $set: !response.check },
                errorMessage: { $set: response.message },
                errorRule: { $set: response.errorRule },
              },
            },
          });
        }
      }
      return {
        newState,
        inputsAsyncRule,
      };
    };

    /**
     * Check if all promises are complete
     * @param {Object} state
     * @private
     */
    _formSubmitSumUp = (state) => {
      let doneCheck = true;
      for (const input in state.inputs) {
        doneCheck = !state.inputs[input].pending;
        if (!doneCheck) break;
      }

      if (doneCheck) {
        if (state.hasError) {
          this._doneSubmit();
          if (typeof this.props.errorCallback === 'function') {
            this.props.errorCallback(state.inputs);
          }
        } else {
          this._submitCallback(cloneDeep(state.inputs), this.props.submitCallback);
        }
      }
    };

    /**
     * Handle submit validate async rules
     * @param {Object} inputsAsyncRule
     * @param {Object} stateWhenHandle
     * @private
     */
    _formSubmitStageHandle = (inputsAsyncRule, stateWhenHandle) => {
      /* istanbul ignore if  else*/
      if (Object.keys(inputsAsyncRule).length > 0) {
        for (const input in inputsAsyncRule) {
          inputsAsyncRule[input].rule.then((result) => {
            if (!this._isUnmounted) {
              this.setState(
                (state) => {
                  const ruleNameAndParam = getRuleNameAndParams(state.inputs[input].asyncRule);
                  return update(state, {
                    hasError: { $set: this._checkHasError(!result, input, state.inputs) },
                    inputs: {
                      [input]: {
                        $merge: {
                          validated: true,
                          dirty: true,
                          error: !result,
                          pending: false,
                          errorRule: !result ? state.inputs[input].asyncRule : '',
                          errorMessage: !result ?
                            formatMessage(
                              this.props.rules[ruleNameAndParam.ruleName].message.error,
                              ruleNameAndParam.params,
                              state.inputs[input],
                              state.inputs,
                            )
                            : '',
                        },
                      },
                    },
                  });
                },
                () => {
                  this._formSubmitSumUp(this.state);
                },
              );
            }
          }).catch((err) => {
            if (err.isCanceled) {
              return;
            }
            console.error(err);
          });
        }
      } else {
        this._formSubmitSumUp(stateWhenHandle);
      }
    };

    /**
     * Handle the form submit
     * @param {Event} event
     * @private
     */
    _formSubmit = (event) => {
      event.preventDefault();
      if (!this._isUnmounted) {
        this.setState({
          submitted: true,
        }, () => {
          const prepare = this._formSubmitStagePrepare(
            this.state, this.props.rules,
            this.onCheckInputPromise,
          );
          const newState = prepare.newState;
          const inputsAsyncRule = prepare.inputsAsyncRule;

          this.setState(newState, () => {
            this._formSubmitStageHandle(inputsAsyncRule, this.state);
          });
        });
      }
    };


    /**
     * Callback done submit that send to Submit callback
     * @private
     */
    _doneSubmit = (shouldReset) => {
      if (!this._isUnmounted) {
        this.setState({
          submitted: false,
        }, () => {
          if (shouldReset) {
            this._reset();
          }
        });
      }
    };

    /**
     * Call the callback when form no error
     * The form submit with no error so now do callback
     * @param {Object} inputs
     * @param {function} callback
     * @private
     */
    _submitCallback = (inputs, callback) => {
      if (typeof callback === 'function') {
        callback(inputs, this._doneSubmit);
      }
    };

    /**
     * Clear all promises
     * @private
     */
    _clearPromises = () => {
      for (const input in this.onCheckInputPromise) {
        this.onCheckInputPromise[input].cancel();
      }
    };

    /**
     * Reset state of the form
     * @private
     */
    _reset = () => {
      if (!this.state.submitted && !this._isUnmounted) {
        this._clearPromises();
        const newState = cloneDeep(this.state);
        newState.hasError = false;
        for (const input in newState.inputs) {
          newState.inputs[input] = Object.assign(
            newState.inputs[input],
            update(newState.inputs[input], {
              dirty: {
                $set: false,
              },
              error: {
                $set: false,
              },
              validated: {
                $set: false,
              },
              errorRule: {
                $set: '',
              },
              pending: {
                $set: false,
              },
              errorMessage: {
                $set: '',
              },
              value: {
                $set: newState.inputs[input].defaultValue || '',
              },
              files: {
                $set: undefined,
              },
            }));
        }
        this.setState(newState);
      }
    };

    render() {
      return (
        <Component
          {...this.props}
          hasError={this.state.hasError}
          submitted={this.state.submitted}
          onSubmit={this._formSubmit}
          reset={this._reset}
        />
      );
    }
  };


export default HOCForm;
