import deepClone from 'lodash.clonedeep';
/**
 * Validate the value base on rule name
 * @param {Object} ruleOb
 * @param {Object} input
 * @param {Array} params
 * @param {Object} allInputs
 * @param {Object} formControl
 * @returns {Boolean} Return false when value is not pass the rule otherwise return true
 */
export function checkRule(ruleOb, input, params, allInputs, formControl) {
  const type = typeof ruleOb.rule;

  switch (type) {
    case 'function':

      return ruleOb.rule(input.value, params, input, allInputs, formControl);

    case 'object':

      if (ruleOb.rule instanceof RegExp) {
        return ruleOb.rule.test(input.value);
      }

      break;

    default:
      return false;
  }

  return false;
}

/**
 * Get the rule name and params
 * @example
 * // returns {ruleName: 'rule', params: ['1','2']}
 * getRuleNameAndParams('rule,1,2');
 * @param {String} rule
 * @returns {{ruleName: String, params: Array}}
 */
export function getRuleNameAndParams(rule) {
  let params = [];
  let ruleName = rule;
  if (ruleName.indexOf(',') !== -1) {
    const temp = ruleName.split(',');

    ruleName = temp[0];

    temp.shift();

    params = temp;
  }

  return {
    ruleName,
    params,
  };
}


/**
 * Format the message with params
 * @example
 * // returns This field length must be min 3 characters and max 7 characters
 * formatMessage('This field length must be min {0} characters and max {1} characters', ['3', '7'])
 * @param {String|Object|Function} message
 * @param {Array} params
 * @param {Object} input
 * @param {Object} allInputs
 * @returns {*}
 */
export function formatMessage(message, params, input, allInputs) {
  let rawMessage;

  if (typeof message === 'function') {
    rawMessage = message(input.value, params, input, allInputs);
  } else {
    rawMessage = message;
  }

  if (typeof rawMessage === 'string') {
    let msg = rawMessage;
    for (let i = 0; i < params.length; i += 1) {
      msg = msg.replace(`{${i}}`, params[i]);
    }
    return msg;
  }

  const cloneMessage = deepClone(rawMessage);
  for (const messageLang in cloneMessage) {
    for (let i = 0; i < params.length; i += 1) {
      cloneMessage[messageLang] = cloneMessage[messageLang].replace(`{${i}}`, params[i]);
    }
  }
  return cloneMessage;
}

/**
 * Validate input value
 * @param {Object} input
 * @param {Object} listRule
 * @param {Object} allInputs
 * @param {Function} allInputs
 * @returns {{check: Boolean, message: Object}}
 */
export function validate(input, listRule, allInputs, formControl) {
  if (!input.rule || (input.optional && !input.value)) {
    return {
      check: true,
      message: '',
      errorRule: '',
    };
  }
  const response = {};
  const rules = input.rule.split('|');
  for (let i = 0; i < rules.length; i += 1) {
    const ruleNameAndParams = getRuleNameAndParams(rules[i]);
    response.check = checkRule(
      listRule[ruleNameAndParams.ruleName],
      input,
      ruleNameAndParams.params,
      allInputs,
      formControl,
    );
    response.errorRule = response.check ? '' : rules[i];
    response.message = response.check
      ? ''
      : formatMessage(
        listRule[ruleNameAndParams.ruleName].message.error,
        ruleNameAndParams.params,
        input,
        allInputs,
      );
    if (!response.check) break;
  }
  return response;
}
