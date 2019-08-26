import React from 'react';
import { mount } from 'enzyme';
import defaultRules from '../src/defaultRules';
import Form from './components/Form';
import Input from './components/Input';

class DefaultValueTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [0],
    };
  }

  click = () => {
    const { value } = this.state;

    this.setState({
      value: [...value, value[value.length - 1] + 1],
    });
  };

  render() {
    const { value } = this.state;

    return (
      <div>
        <button id="button" onClick={this.click}>Click</button>
        <Form
          validateLang="vi"
          rules={defaultRules}
        >
          <div>
            <Input
              defaultValue={value}
              type="text"
              name="userName"
            />
          </div>
        </Form>
      </div>
    );
  }
}

/* global describe it expect jasmine beforeEach afterEach */
describe('Test default value in input', () => {
  let FormTest;
  let FromTestRender;
  beforeEach(() => {
    FormTest = () => (
      <DefaultValueTest />
    );

    FromTestRender = mount(
      <FormTest />,
    );
  });

  it('Should update default value correctly', () => {
    const button = FromTestRender.find('#button');
    button.simulate('click');
    expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
      value: [0, 1],
      defaultValue: [0, 1],
      dirty: false,
    }));

    button.simulate('click');
    expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
      value: [0, 1, 2],
      defaultValue: [0, 1, 2],
      dirty: false,
    }));
  });

  it('Should update default value and not change dirty', () => {
    const userNameInput = FromTestRender.find('input[name="userName"]');

    const button = FromTestRender.find('#button');
    button.simulate('click');
    expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
      value: [0, 1],
      defaultValue: [0, 1],
      dirty: false,
    }));

    userNameInput.simulate('change', { target: { value: [0, 1], name: 'userName' } });

    expect(FromTestRender.find('Input').getElements()[0].props).toEqual(jasmine.objectContaining({
      value: [0, 1],
      defaultValue: [0, 1],
      dirty: false,
    }));
  });
});
