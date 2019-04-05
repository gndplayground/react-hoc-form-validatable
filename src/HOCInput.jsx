import React from 'react';
import PropTypes from 'prop-types';
import { formatMessage, getRuleNameAndParams } from './validateHelpers';
import FormContext from './context';

/**
 * Higher order component that wrap the input and pass necessary props
 * @param Component
 * @constructor
 */
const HOCInput = Component => class HOCInputValidateAble extends React.Component {
  /**
     * Component prop types
     * @type {object}
     * @property {string} name - Name of the input
     * @property {string} rule - Validation rules of the input
     * @property {string} asyncRule - Async validation rules of the input
     * @property {*} defaultValue - Default value of the input
     */

    static contextType = FormContext;

    static propTypes = {
      rule: PropTypes.string,
      asyncRule: PropTypes.string,
      customErrorMessages: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),

      name: PropTypes.string.isRequired,
      defaultValue: PropTypes.any,
      optional: PropTypes.bool,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
    };

    /**
     * React life cycle
     */
    componentWillMount() {
      const { validateRegister } = this.context;
      const {
        name, defaultValue, rule, asyncRule, optional,
      } = this.props;
      validateRegister(
        name,
        {
          name,
          defaultValue,
          value: defaultValue || defaultValue === 0 ? defaultValue : '',
          rule,
          asyncRule,
          optional,
        },
      );
    }

    componentWillReceiveProps(nextProps) {
      const {
        defaultValue, rule, asyncRule, optional, name,
      } = this.props;
      const { validateRegister, validateInputs } = this.context;
      if (
        nextProps.defaultValue !== defaultValue
          || nextProps.rule !== rule
          || nextProps.asyncRule !== asyncRule
          || nextProps.optional !== optional
      ) {
        const input = validateInputs[name];
        validateRegister(
          name,
          {
            name,
            defaultValue: nextProps.defaultValue,
            value: defaultValue === input.value
                && nextProps.defaultValue !== defaultValue
              ? nextProps.defaultValue : input.value,
            rule: nextProps.rule,
            asyncRule: nextProps.asyncRule,
            optional: nextProps.optional,
          },
        );
      }
    }

    componentWillUnmount() {
      const { validateUnRegister } = this.context;
      const { name } = this.props;
      validateUnRegister(name);
    }

    /**
     * Handle when the value of the input is changed
     * @param e
     * @private
     */
    _inputOnchange = (e) => {
      const { validateInputOnChange } = this.context;
      const { onChange } = this.props;
      if (e) {
        if (onChange) {
          onChange(e);
        }
        e.persist();
        validateInputOnChange(e.target.name, e.target.value, e.target.files);
      }
    };

    /**
     * Handle when the focus out of the input
     * @param e
     * @private
     */
    _inputOnBlur = (e) => {
      const { validateInputOnChange } = this.context;
      const { onBlur } = this.props;
      if (e) {
        if (onBlur) {
          onBlur(e);
        }
        e.persist();
        validateInputOnChange(e.target.name, e.target.value, e.target.files);
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
      const { validateInputs, validateSubmitted, validateLang } = this.context;
      const {
        name, customErrorMessages, defaultValue, rule, asyncRule, ...other
      } = this.props;
      const input = validateInputs[name];
      return (
        input
          ? (
            <Component
              {...other}
              lang={validateLang}
              submitted={validateSubmitted}
              validated={input.validated}
              value={input.value}
              files={input.files}
              dirty={input.dirty}
              error={input.error}
              pending={input.pending}
              errorMessage={
              this._getMessage(input, customErrorMessages, validateInputs)
            }
              defaultValue={defaultValue}
              name={name}
              onBlur={this._inputOnBlur}
              onChange={this._inputOnchange}
            />
          ) : <span />

      );
    }
};


export default HOCInput;
