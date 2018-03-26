const ruleObDefault = {
  isEmail: {
    rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    message: {
      error: {
        en: 'This field must be a valid email address.',
        vi: 'Hãy nhập một địa chỉ email hợp lệ vào ô này',
      },
    },
  },

  notEmpty: {
    rule(value) {
      return (!(value === null || value === '' || value === undefined));
    },

    message: {
      error: {
        en: 'This field is mandatory.',
        vi: 'Ô này không đươc để trống',
      },
    },
  },

  minLength: {
    rule(value, param) {
      return value.length >= param[0];
    },

    message: {
      error: {
        en: 'The value entered must be at least {0} characters.',
        vi: 'Ô này phải chứa ít nhất {0} ký tự',
      },
    },
  },

  maxLength: {
    rule(value, param) {
      return value.length <= param[0];
    },

    message: {
      error: {
        en: 'The value entered must not be greater than {0} characters.',
        vi: 'Ô này độ dài tối đa {0} ký tự',
      },
    },
  },

  betweenLength: {
    rule(value, param) {
      return value.length >= param[0] && value.length <= param[1];
    },

    message: {
      error: {
        en: 'The value entered must be between {0} characters and {1} characters.',
        vi: 'Ô này độ dài phải từ {0} ký tự và {1} ký tự',
      },
    },
  },

  isNumeric: {
    rule: /^[-+]?(?:\d*[.])?\d+$/,

    message: {
      error: {
        en: 'The value entered must be a numeric value.',
        vi: 'Ô này phải là một số',
      },
    },
  },

  isInt: {
    rule: value => !isNaN(value) && (value % 1 === 0),

    message: {
      error: {
        en: 'The value entered must be an integer.',
        vi: 'Ô này phải là một số nguyên',
      },
    },
  },

  isAlpha: {
    rule: /^[A-Z]+$/i,

    message: {
      error: {
        en: 'The value entered must be alphabetic characters only.',
        vi: 'Ô này chỉ được chứa chữ cái',
      },
    },
  },
};


export default ruleObDefault;