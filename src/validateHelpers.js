/**
 * Validate the value base on rule name
 * @param {Object} ruleOb
 * @param {*} value
 * @param {Array} params
 * @param {Object} allInputs
 * @returns {Boolean} Return false when value is not pass the rule otherwise return true
 */
export function checkRule(ruleOb, value, params, allInputs) {
  const type = typeof ruleOb.rule;

  switch (type) {

    case 'function':

      return ruleOb.rule(value, params, allInputs);

    case 'object':

      if (ruleOb.rule instanceof RegExp) {
        return ruleOb.rule.test(value);
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
 * @param message
 * @param params
 * @returns {*}
 */
export function formatMessage(message, params) {
  const cloneMessage = Object.assign({}, message);
  for (const messageLang in cloneMessage) {
    for (let i = 0; i < params.length; i += 1) {
      cloneMessage[messageLang] = cloneMessage[messageLang].replace(`{${i}}`, params[i]);
    }
  }
  return cloneMessage;
}

/**
 * Validate input value
 * @param {any} value
 * @param {String} ruleString
 * @param {Object} listRule
 * @param {Object} allInputs
 * @returns {{check: Boolean, message: Object}}
 */
export function validate(value, ruleString, listRule, allInputs) {
  const response = {};
  const rules = ruleString.split('|');
  for (let i = 0; i < rules.length; i += 1) {
    const ruleNameAndParams = getRuleNameAndParams(rules[i]);
    response.check = checkRule(
      listRule[ruleNameAndParams.ruleName],
      value,
      ruleNameAndParams.params,
      allInputs,
    );
    response.errorRule = response.check ? '' : ruleNameAndParams.ruleName;
    response.message = response.check ?
      '' :
      formatMessage(listRule[ruleNameAndParams.ruleName].message.error, ruleNameAndParams.params);
    if (!response.check) break;
  }
  return response;
}
