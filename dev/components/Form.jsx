import React from 'react';
import PropTypes from 'prop-types';
import HOCForm from '../../src/HOCForm';

class Form extends React.Component {

  render() {
    return (

      <form
        noValidate
        onSubmit={this.props.onSubmit}
        ref={(e) => {
          this.form = e;
        }}
      >
        {
          (this.props.hasError ? (<p>Form has errors</p>) : '')
        }

        {this.props.children}

        <button type="submit" disabled={this.props.submitted} >Submit</button>
        {
          (this.props.hasResetButton ? (<button type="reset" disabled={this.props.submitted} onClick={this.props.reset}>Reset</button>) : '')
        }
      </form>
    );
  }
}


Form.propTypes = {
  hasResetButton: PropTypes.bool,
  hasError: PropTypes.bool,
  onSubmit: PropTypes.func,
  reset: PropTypes.func,
  submitted: PropTypes.bool,
  children: PropTypes.node,
};

export default HOCForm(Form);
