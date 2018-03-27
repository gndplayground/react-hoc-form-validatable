import defaultRules from '../src/defaultRules';
import { checkRule, getRuleNameAndParams, formatMessage, validate } from '../src/validateHelpers';

/* global describe it expect*/
describe('Test checkRule function', () => {
  it('Should return true when check rule object is correct', () => {
    const rule = {
      rule(value, param) {
        return value.length >= param[0];
      },
    };
    const params = [5];

    const input = {
      value: '123456',
    };

    expect(checkRule(rule, input, params, {})).toBe(true);
  });

  it('Should return false when check rule object is not correct', () => {
    const rule = {
      rule(value, param) {
        return value.length >= param[0];
      },
    };
    const params = [5];

    const input = {
      value: '123',
    };

    expect(checkRule(rule, input, params, {})).toBe(false);
  });

  it('Should return true when check rule regex is correct', () => {
    const rule = {
      rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    };

    expect(checkRule(rule, { value: 'giang.nguyen.dev@gmail.com' })).toBe(true);
  });

  it('Should return false when check rule regex is not correct', () => {
    const rule = {
      rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    };

    expect(checkRule(rule, { value: 'giang.nguyen.dev' })).toBe(false);
  });

  it('Should return false when rule object is not a object or Regex', () => {
    expect(checkRule({}, { value: 'aaaa' }, [])).toBe(false);
    expect(checkRule('aaaa', { value: 'aaaa' }, [])).toBe(false);
  });
});

describe('Check getRuleNameAndParams function', () => {
  it('Should return object that hold rule name and param', () => {
    expect(getRuleNameAndParams('name,1,2')).toEqual({ ruleName: 'name', params: ['1', '2'] });
    expect(getRuleNameAndParams('name')).toEqual({ ruleName: 'name', params: [] });
  });
});

describe('Check formatMessage function', () => {
  it('Should format message object with params correct', () => {
    expect(formatMessage({
      en: 'Do {0} and {1}',
      vi: 'Do {0} and {1}',
    }, [0, 1])).toEqual({
      en: 'Do 0 and 1',
      vi: 'Do 0 and 1',
    });
  });

  it('Should format message string with params correct', () => {
    expect(formatMessage('Do {0} and {1}', [0, 1])).toEqual('Do 0 and 1');
  });

  it('Should format message type of function correct with function return string', () => {
    const input = {
      name: 'input',
      value: 'value',
    };

    const otherInputs = {
      other: {
        name: 'other input',
        value: 'other input value',
      },
    };

    const messageFunction = (value, params, _input, _otherInputs) =>
      `${input.name} ${value} {0} ${_otherInputs.other.name} ${_otherInputs.other.value}`;

    expect(formatMessage(messageFunction, ['param'], input, otherInputs))
      .toEqual('input value param other input other input value');
  });

  it('Should format message type of function correct with function return object', () => {
    const input = {
      name: 'input',
      value: 'value',
    };

    const otherInputs = {
      other: {
        name: 'other input',
        value: 'other input value',
      },
    };

    const messageFunction = (value, params, _input, _otherInputs) => ({
      en: `en ${input.name} ${value} {0} ${_otherInputs.other.name} ${_otherInputs.other.value}`,
      vi: `vi ${input.name} ${value} {0} ${_otherInputs.other.name} ${_otherInputs.other.value}`,
    });

    const result = formatMessage(messageFunction, ['param'], input, otherInputs);

    expect(result.en)
      .toEqual('en input value param other input other input value');
    expect(result.vi)
      .toEqual('vi input value param other input other input value');
  });
});

describe('Check validate function', () => {
  it('Should return check true when ruleString is empty', () => {
    const response = validate({ value: '123456' }, '');

    expect(response).toEqual({
      check: true,
      errorRule: '',
      message: '',
    });
  });

  it('Should return check true when input is optional and value is empty', () => {
    const response = validate({ value: '', rule: 'minLength,10', optional: true }, defaultRules);

    expect(response).toEqual({
      check: true,
      errorRule: '',
      message: '',
    });
  });

  it('Should check a rule that return object check false and error message with input is optional and has value', () => {
    const response = validate({ value: '1', rule: 'minLength,10', optional: true}, defaultRules);

    expect(response).toEqual({
      check: false,
      errorRule: 'minLength,10',
      message: {
        en: 'The value entered must be at least 10 characters.',
        vi: 'Ô này phải chứa ít nhất 10 ký tự',
      },
    });
  });

  it('Should check a rule that return object check false and error message', () => {
    const response = validate({ value: '123456', rule: 'minLength,10' }, defaultRules);

    expect(response).toEqual({
      check: false,
      errorRule: 'minLength,10',
      message: {
        en: 'The value entered must be at least 10 characters.',
        vi: 'Ô này phải chứa ít nhất 10 ký tự',
      },
    });
  });

  it('Should check a rule that return object check true and empty error message', () => {
    const response = validate({ value: '123456', rule: 'minLength,5' }, defaultRules);

    expect(response).toEqual({
      check: true,
      errorRule: '',
      message: '',
    });
  });
});
