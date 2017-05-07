import React from 'react';


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
      name: React.PropTypes.string.isRequired,
      rule: React.PropTypes.string,
      asyncRule: React.PropTypes.string,
      defaultValue: React.PropTypes.any,
    };

    /**
     * Component access contexts
     * @type {object}
     * @property {function} validateRegister - Handle Register or update state of the input to form
     */
    static contextTypes = {
      validateLang: React.PropTypes.string.isRequired,
      validateInputOnChange: React.PropTypes.func.isRequired,
      validateInputs: React.PropTypes.object,
      validateRegister: React.PropTypes.func.isRequired,
      validateSubmitted: React.PropTypes.bool.isRequired,
      validateUnRegister: React.PropTypes.func.isRequired,
    };

    /**
     * React life cycle
     */
    componentWillMount() {
      this.context.validateRegister(
        this.props.name,
        {
          defaultValue: this.props.defaultValue,
          value: this.props.defaultValue || '',
          rule: this.props.rule,
          asyncRule: this.props.asyncRule,
        },
      );
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
      this.context.validateRegister(
        this.props.name,
        {
          value: e.target.value,
        },
      );
      e.persist();
      this.context.validateInputOnChange(e.target.name, e.target.value);
    };

    /**
     * Handle when the focus out of the input
     * @param e
     * @private
     */
    _inputOnBlur = (e) => {
      e.persist();
      this.context.validateInputOnChange(e.target.name, e.target.value);
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
              dirty={input.dirty}
              error={input.error}
              pending={input.pending}
              errorMessage={input.errorMessage}
              defaultValue={this.props.defaultValue}
              name={this.props.name}
              onBlur={this._inputOnBlur}
              onChange={this._inputOnchange}
            /> : <span />

      );
    }
};


export default HOCInput;
