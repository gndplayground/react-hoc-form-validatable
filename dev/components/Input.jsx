import React from 'react';
import PropTypes from 'prop-types';
import style from './styles/input.css';
import HOCInput from '../../src/HOCInput';

class Input extends React.Component {

  _getClassName = (state, propClass) => {
    let className = '';
    if (state.pending) className = style.inputPending;
    else if (state.error) className = style.inputError;
    else if (state.validate && !state.error && !state.pending) className = style.inputValid;
    return `${className} ${propClass || ''}`;
  };

  render() {
    return (
      <div className={`${style.wrap} ${this.props.wrapClassName}`}>
        {
          this.props.label ? (<label className={style.label} htmlFor={this.props.name}>{this.props.label}</label>) : ''
        }
        <div className={style.inputWrap}>
          <input
            disabled={this.props.submitted}
            value={this.props.value}
            className={`${this._getClassName({
              validate: this.props.validated,
              error: this.props.error,
              pending: this.props.pending,
              dirty: this.props.dirty,
            }, this.props.inputClassName)} ${style.input} `}
            type={this.props.type}
            name={this.props.name}
            onBlur={this.props.onBlur}
            onChange={this.props.onChange}
          />

          {
            this.props.pending ? (
              <div className={style.loading}>
                <span />
                <span />
                <span />
              </div>
            ) : ''
          }

        </div>
        {this.props.error ? (
          <div
            className={`${style.errorMessage} ${this.props.errorClassName || ''}`}
          > {typeof this.props.errorMessage === 'string' ? this.props.errorMessage : this.props.errorMessage[this.props.lang]}</div>
        ) : ''}
      </div>
    );
  }
}

Input.propTypes = {
  inputClassName: PropTypes.string,
  wrapClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  error: PropTypes.bool,
  validated: PropTypes.bool,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  pending: PropTypes.bool,
  dirty: PropTypes.bool,
  lang: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
};


export default HOCInput(Input);
