import React from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import defaultRules from '../../src/defaultRules';

const handlerSubmit = (inputs, done) => {
  done(true);
  alert('Submit callback success and reset the form');
};

const extendDemoRules = {
  fileSizeLimit: {
    rule: (value, params, input) => {
      for (let i = 0; i < input.files.length; i += 1) {
        if (input.files[i].size > params[0]) {
          return false;
        }
      }
      return true;
    },
    message: {
      error: 'This field size limit to {0} byte',
    },
  },

  validateFileType: {

    rule: (value, params, input) => {
      for (let i = 0; i < input.files.length; i += 1) {
        if (!input.files[i].type.match('image') ||
          params.indexOf(input.files[i].type.split('/')[1]) === -1) {
          return false;
        }
      }
      return true;
    },

    message: {
      error: 'This field has to be a valid type',
    },
  },
};

const validateRules = Object.assign({}, defaultRules, extendDemoRules);

const FileExample = () => (
  <div>
    <h2>Form input files</h2>
    <p>Field input with custom rules will validate for valid file types jpg, png, jpeg
      (&quot;validateFileType,jpg,png,jpeg&quot;)
      and max file size each picture 50kb (&quot;fileSizeLimit,50000&quot;)</p>
    <p> Currently the input in the form take multiple files
      and the custom rule for each max file size. You can write a custom rule
      that limit total files size.</p>
    <Form
      validateLang="en"
      submitCallback={handlerSubmit}
      rules={validateRules}
      hasResetButton
    >
      <div>
        <Input
          multiple
          label="Choose your pictures"
          errorClassName="error-message"
          wrapClassName="input-group"
          type="file"
          name="pictures"
          rule="notEmpty|validateFileType,jpg,png,jpeg|fileSizeLimit,50000"
          customErrorMessages={{
            validateFileType: 'This field has to be a valid type jpg, png, jpeg',
          }}
        />
      </div>

      <br />

    </Form></div>
);

export default FileExample;
