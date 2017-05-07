import React from 'react';
import update from 'immutability-helper';
import Form from '../components/Form';
import Input from '../components/Input';
import defaultRules from '../../src/defaultRules';

class DynamicExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: [
        {
          id: Math.random(),
          label: 'Choose your user name',
          errorClassName: 'error-message',
          wrapClassName: 'input-group',
          type: 'text',
          name: 'userName',
          defaultValue: '123',
          rule: 'notEmpty|minLength,4',
        },
      ],
    };
  }

  addInput = () => {
    this.setState(
      (state) => {
        const id = Math.random();
        return update(state, {
          inputs: {
            $push: [{
              id,
              label: `Choose your user name (${id})`,
              errorClassName: 'error-message',
              wrapClassName: 'input-group',
              type: 'text',
              name: `userName${id}`,
              defaultValue: '123',
              rule: 'notEmpty|minLength,4',
            }],
          },
        });
      });
  };


  handlerSubmit = (a, done) => {
    done(true);
    alert('Submit callback success and reset the form');
  };


  removeInput = () => {
    this.setState(
      (state) => {
        const newInputs = state.inputs.splice(0);
        newInputs.pop();
        return update(state, {
          inputs: {
            $set: newInputs,
          },
        });
      },
    );
  };

  render() {
    return (
      <div>
        <h2>Dynamic input example</h2>

        <p>Each time an input is added or removed.
          The input state will be register or unregister from the store</p>

        <button onClick={this.addInput}>Add</button>
        <button onClick={this.removeInput}>Remove</button>

        <br />

        <br />

        <Form
          validateLang="en"
          submitCallback={this.handlerSubmit}
          rules={defaultRules}
          hasResetButton
        >

          {
            this.state.inputs.map(test => <Input {...test} key={test.id} />)
          }

        </Form>
      </div>
    );
  }
}

export default DynamicExample;
