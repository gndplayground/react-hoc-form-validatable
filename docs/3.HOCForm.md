`HOCForm` is a core component of the library.  It will mainly handle logics to validate inputs, submit the form...

## Basic usage

```javascript
import {HOCForm} from 'react-hoc-form-validatable'

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
          type="text"
          name="userName"
          defaultValue="123"
          rule="notEmpty|minLength,4"
        />
        <Input
          label="Your email"
          type="email"
          name="email"
          rule="notEmpty|isEmail"
        />
        <Input
          label="Your login password"
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
  hasError: React.PropTypes.bool,
  onSubmit: React.PropTypes.func,
  reset: React.PropTypes.func,
  submitted: React.PropTypes.bool,
  children: React.PropTypes.node,
};

export default HOCForm(FormDemoBasic);

```

`HOCForm` will wrap your form component and send these props

* `hasError` (Boolean) If has error in inputs.
* `submitted` (Boolean) Equal true if the form is submitting. 
* `onSubmit` (Function) Submit handler for your form
* `reset` (Function) Reset the state of all inputs

Then we use it

```javascript

const handlerSubmit = (inputs, done) => {
  done(true);
  alert('Submit callback success and reset the form');
};

<FormDemoBasic 
    validateLang="en"
    submitCallback={handlerSubmit}
    rules={defaultRules}
/>

```

We have to provide 
* `validateLang` (String) language for the form. 
Error message will take this prop to return message with correct language

* `rules` {Object} An object hold all validation rules type so the form can lookup the validation rules

* `submitCallback` {Function} A function that handler submit the form after all inputs is valid.

`submitCallback` will be called with two parameter

```javascript

const handlerSubmit = (inputs, done) => {
  done(true);
  alert('Submit callback success and reset the form');
};

```

* `inputs` {Object} return inputs state object so you could grab the input value to call for api
* `done` {Function} When you call done(). The form will finish the submit.
The prop `submitted` will become false. You should call `done` when you finish your call api to server or do other stuff.
Pass true to `done` callback will reset the form inputs.
