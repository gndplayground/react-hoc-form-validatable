import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import HOCForm from '../../src/HOCForm';

class FormDemoBasic extends React.Component {

  render() {
    return (

      <form
        noValidate
        onSubmit={this.props.onSubmit}
      >
        {
          (this.props.hasError ? (<p>The form has errors, please correct!</p>) : '')
        }

        <Input
          label="Choose your user name"
          errorClassName="error-message"
          wrapClassName="input-group"
          type="text"
          name="userName"
          defaultValue="123"
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

        <button type="submit" disabled={this.props.submitted} >Submit</button>
        <button type="reset" disabled={this.props.submitted} onClick={this.props.reset}>Reset</button>
      </form>
    );
  }
}


FormDemoBasic.propTypes = {
  hasError: PropTypes.bool,
  onSubmit: PropTypes.func,
  reset: PropTypes.func,
  submitted: PropTypes.bool,
  children: PropTypes.node,
};

export default HOCForm(FormDemoBasic);
