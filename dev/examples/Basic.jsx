import React from 'react';
import FormDemoBasic from '../components/FormDemoBasic';
import defaultRules from '../../src/defaultRules';

const handlerSubmit = (a, done) => {
  done(true);
  alert('Submit callback success and reset the form');
};

const Basic = () => (
  <div>
    <h2>Basic example</h2>
    <FormDemoBasic
      validateLang="en"
      submitCallback={handlerSubmit}
      rules={defaultRules}
    /></div>);


export default Basic;
