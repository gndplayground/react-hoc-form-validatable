import React from 'react';
import PropTypes from 'prop-types';
import { formatMessage, getRuleNameAndParams } from './validateHelpers';


/**
 * Higher order component that wrap the input and pass necessary props
 * @param Component
 * @constructor
 */
const HOCInput = Component =>
  class HOCInputValidateAble extends React.Component {
    /**
     * Component prop types
     * @type {object}
     * @property {string} name - Name of the input
     * @property {string} rule - Validation rules of the input
     * @property {string} asyncRule - Async validation rules of the input
     * @property {*} defaultValue - Default value of the input
     */
    static propTypes = {
      name: PropTypes.string.isRequired,
      rule: PropTypes.string,
      asyncRule: PropTypes.string,
      defaultValue: PropTypes.any,
      customErrorMessages: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
      optional: PropTypes.bool,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
    };

    /**
     * Component access contexts
     * @type {object}
     * @property {function} validateRegister - Handle Register or update state of the input to form
     */
    static contextTypes = {
      validateLang: PropTypes.string.isRequired,
      validateInputOnChange: PropTypes.func.isRequired,
      validateInputs: PropTypes.object,
      validateRegister: PropTypes.func.isRequired,
      validateSubmitted: PropTypes.bool.isRequired,
      validateUnRegister: PropTypes.func.isRequired,
    };

    /**
     * React life cycle
     */
    componentWillMount() {
      this.context.validateRegister(
        this.props.name,
        {
          name: this.props.name,
          defaultValue: this.props.defaultValue,
          value: this.props.defaultValue || '',
          rule: this.props.rule,
          asyncRule: this.props.asyncRule,
          optional: this.props.optional,
        },
      );
    }

    componentWillReceiveProps(nextProps) {
      if (
          nextProps.defaultValue !== this.props.defaultValue ||
          nextProps.rule !== this.props.rule ||
          nextProps.asyncRule !== this.props.asyncRule ||
          nextProps.optional !== this.props.optional
      ) {
        const input = this.context.validateInputs[this.props.name];
        this.context.validateRegister(
          this.props.name,
          {
            name: this.props.name,
            defaultValue: nextProps.defaultValue,
            value: this.props.defaultValue === input.value &&
                nextProps.defaultValue !== this.props.defaultValue ?
                nextProps.defaultValue : input.value,
            rule: nextProps.rule,
            asyncRule: nextProps.asyncRule,
            optional: nextProps.optional,
          },
        );
      }
    }

    componentWillUnmount() {
      this.context.validateUnRegister(this.props.name);
    }

    /**
     * Handle when the value of the input is changed
     * @param e
     * @private
     */
    _inputOnchange = (e) => {
      if (e) {
        if (this.props.onChange) {
          this.props.onChange(e);
        }
        e.persist();
        this.context.validateInputOnChange(e.target.name, e.target.value, e.target.files);
      }
    };

    /**
     * Handle when the focus out of the input
     * @param e
     * @private
     */
    _inputOnBlur = (e) => {
      if (e) {
        if (this.props.onBlur) {
          this.props.onBlur(e);
        }
        e.persist();
        this.context.validateInputOnChange(e.target.name, e.target.value, e.target.files);
      }
    };

    /**
     * Get message for input by default message or custom message
     * @param {Object} input - Current Input state
     * @param {Object} listCustomMessage - List custom error messages
     * @param {Object} allInputs - All inputs state
     * @returns {String|Object}
     * @private
     */
    _getMessage = (input, listCustomMessage, allInputs) => {
      if (input.errorRule) {
        const errorRuleAndParam = getRuleNameAndParams(input.errorRule);
        if (input.error && listCustomMessage && listCustomMessage[errorRuleAndParam.ruleName]) {
          return formatMessage(
             listCustomMessage[errorRuleAndParam.ruleName],
             errorRuleAndParam.params,
             input,
             allInputs,
           );
        }
      }
      return input.errorMessage;
    };

    /**
     * Return wrapped component with props
     * @returns {ReactElement}
     */
    render() {
      const input = this.context.validateInputs[this.props.name];
      return (
        input ?
          <Component
            {...this.props}
            lang={this.context.validateLang}
            submitted={this.context.validateSubmitted}
            validated={input.validated}
            value={input.value}
            files={input.files}
            dirty={input.dirty}
            error={input.error}
            pending={input.pending}
            errorMessage={
              this._getMessage(input, this.props.customErrorMessages, this.context.validateInputs)
            }
            defaultValue={this.props.defaultValue}
            name={this.props.name}
            onBlur={this._inputOnBlur}
            onChange={this._inputOnchange}
          /> : <span />

      );
    }
  };


export default HOCInput;
