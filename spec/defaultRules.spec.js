import defaultRules from '../src/defaultRules';

/* global describe it expect*/
describe('isEmail rule', () => {
  it('Should return true when check "giang.nguyen.dev@gmail.com"', () => {
    expect(defaultRules.isEmail.rule.test('giang.nguyen.dev@gmail.com')).toEqual(true);
  });

  it('Should return false when check "gndplayground@"', () => {
    expect(defaultRules.isEmail.rule.test('gndplayground@')).toEqual(false);
  });
});

describe('notEmpty rule', () => {
  it('Should return true when has value', () => {
    expect(defaultRules.notEmpty.rule('aaa')).toEqual(true);
  });

  it('Should return true when value is empty', () => {
    expect(defaultRules.notEmpty.rule('')).toEqual(false);
  });
});

describe('minLength rule', () => {
  it('Should return true when value length equal defined', () => {
    expect(defaultRules.minLength.rule('12345', [5])).toEqual(true);
  });

  it('Should return true when value length > defined', () => {
    expect(defaultRules.minLength.rule('12345', [4])).toEqual(true);
  });

  it('Should return false when value length < defined', () => {
    expect(defaultRules.minLength.rule('12345', [6])).toEqual(false);
  });
});

describe('maxLength rule', () => {
  it('Should return true when value length equal defined', () => {
    expect(defaultRules.maxLength.rule('12345', [5])).toEqual(true);
  });

  it('Should return true when value length > defined', () => {
    expect(defaultRules.maxLength.rule('12345', [4])).toEqual(false);
  });

  it('Should return false when value length < defined', () => {
    expect(defaultRules.maxLength.rule('12345', [6])).toEqual(true);
  });
});

describe('betweenLength rule', () => {
  it('Should return true when value is in between', () => {
    expect(defaultRules.betweenLength.rule('12345', ['2', '5'])).toEqual(true);
  });

  it('Should return false when value is not in between', () => {
    expect(defaultRules.betweenLength.rule('12345', ['2', '4'])).toEqual(false);
  });
});

describe('isNumeric rule', () => {
  it('Should return true when value is numeric', () => {
    expect(defaultRules.isNumeric.rule.test('1.5')).toEqual(true);
    expect(defaultRules.isNumeric.rule.test('-1.5')).toEqual(true);
    expect(defaultRules.isNumeric.rule.test('01')).toEqual(true);
    expect(defaultRules.isNumeric.rule.test('0')).toEqual(true);
  });

  it('Should return false when value is not numeric ', () => {
    expect(defaultRules.isNumeric.rule.test('aaa1.5')).toEqual(false);
    expect(defaultRules.isNumeric.rule.test('aaa1aaa')).toEqual(false);
  });
});

describe('isAlpha rule', () => {
  it('Should return true when value is alpha', () => {
    expect(defaultRules.isAlpha.rule.test('abcAA')).toEqual(true);
  });

  it('Should return false when value is not all alpha', () => {
    expect(defaultRules.isAlpha.rule.test('abcAA1')).toEqual(false);
  });
});


describe('isInt rule', () => {
  it('Should return true when value is int', () => {
    expect(defaultRules.isInt.rule('1')).toEqual(true);
    expect(defaultRules.isInt.rule('12')).toEqual(true);
    expect(defaultRules.isInt.rule('-8')).toEqual(true);
  });

  it('Should return false when value is not int', () => {
    expect(defaultRules.isInt.rule('abcAA1')).toEqual(false);
    expect(defaultRules.isInt.rule('5.3')).toEqual(false);
  });
});
