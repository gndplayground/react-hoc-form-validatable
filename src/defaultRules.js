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
      return (!(value === null || value === ''));
    },

    message: {
      error: {
        en: 'This field must be not empty',
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
        en: 'This field length must be at least {0} character',
        vi: 'Ô này phải chứa ít nhất {0} ký tự',
      },
    },

  },
};


export default ruleObDefault;
