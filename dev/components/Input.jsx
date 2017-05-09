import React from 'react';
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
  inputClassName: React.PropTypes.string,
  wrapClassName: React.PropTypes.string,
  errorClassName: React.PropTypes.string,
  label: React.PropTypes.string,
  value: React.PropTypes.any,
  defaultValue: React.PropTypes.any,
  error: React.PropTypes.bool,
  validated: React.PropTypes.bool,
  errorMessage: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  pending: React.PropTypes.bool,
  dirty: React.PropTypes.bool,
  lang: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  onBlur: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  submitted: React.PropTypes.bool.isRequired,
};


export default HOCInput(Input);
