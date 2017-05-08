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

    expect(checkRule(rule, '123456', params)).toBe(true);
  });

  it('Should return false when check rule object is not correct', () => {
    const rule = {
      rule(value, param) {
        return value.length >= param[0];
      },
    };
    const params = [5];

    expect(checkRule(rule, '123', params)).toBe(false);
  });

  it('Should return true when check rule regex is correct', () => {
    const rule = {
      rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    };

    expect(checkRule(rule, 'giang.nguyen.dev@gmail.com')).toBe(true);
  });

  it('Should return false when check rule regex is not correct', () => {
    const rule = {
      rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    };

    expect(checkRule(rule, 'giang.nguyen.dev')).toBe(false);
  });

  it('Should return false when rule object is not a object or Regex', () => {
    expect(checkRule({}, 'aaaa', [])).toBe(false);
    expect(checkRule('aaaa', 'aaaa', [])).toBe(false);
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
});

describe('Check validate function', () => {
  it('Should check a rule that return object check false and error message', () => {
    const response = validate('123456', 'minLength,10', defaultRules);

    expect(response).toEqual({
      check: false,
      errorRule: 'minLength',
      message: {
        en: 'This field length must be at least 10 characters',
        vi: 'Ô này phải chứa ít nhất 10 ký tự',
      },
    });
  });

  it('Should check a rule that return object check true and empty error message', () => {
    const response = validate('123456', 'minLength,5', defaultRules);

    expect(response).toEqual({
      check: true,
      errorRule: '',
      message: '',
    });
  });
});
