const ruleObDefault = {
  isEmail: {
    rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    message: {
      error: 'This field must be a valid email address.',
    },
  },

  notEmpty: {
    rule(value) {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      const val = typeof value === 'string' ? value.trim() : value;
      return !(val === null || val === '' || val === undefined);
    },

    message: {
      error: 'This field is mandatory.',
    },
  },

  minLength: {
    rule(value, param) {
      return value.length >= param[0];
    },

    message: {
      error: 'The value entered must be at least {0} characters.'
      ,
    },
  },

  maxLength: {
    rule(value, param) {
      return value.length <= param[0];
    },

    message: {
      error: 'The value entered must not be greater than {0} characters.',
    },
  },

  betweenLength: {
    rule(value, param) {
      return value.length >= param[0] && value.length <= param[1];
    },

    message: {
      error: 'The value entered must be between {0} characters and {1} characters.',
    },
  },

  isNumeric: {
    rule: /^[-+]?(?:\d*[.])?\d+$/,

    message: {
      error: 'The value entered must be a numeric value.',
    },
  },

  isInt: {
    rule: value => !Number.isNaN(value) && (value % 1 === 0),

    message: {
      error: 'The value entered must be an integer.',
    },
  },

  isAlpha: {
    rule: /^[A-Z]+$/i,

    message: {
      error: 'The value entered must be alphabetic characters only.',
    },
  },
};


export default ruleObDefault;
