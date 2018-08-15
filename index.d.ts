import * as React from "react";


export interface FormValidateProps {
    validateLang?: string;
    submitCallback?: (inputs: {
        [k: string]: InputStates
    }, done: (reset?: boolean) => void) => void;
    errorCallback?: () => void;
    errorAsyncRuleCallback?: (error: Error) => void;
    rules: any;
}

export interface FormValidateChildProps {
    hasError: true;
    submitted: true;
    onSubmit: () => void;
    reset: () => void;
}

export interface InputValidateProps {
    name: string;
    defaultValue?: any;
    rule?: string;
    asyncRule?: string;
    customErrorMessages?: {
        [k: string]: any;
    };
}

export interface InputValidateChildProps {
    dirty: boolean;
    optional: boolean;
    validated: boolean;
    error: boolean;
    submitted: boolean;
    value: any;
    defaultValue: any;
    type: string;
    name: string;
    onBlur: () => void;
    onChange: () => void;
    errorMessage: string;
    label: string;
    lang: string;
    pending: boolean;
    onChangeValue: () => void;
}

export interface InputStates {
    name: string,
    asyncRule: string,
    defaultValue: any,
    dirty: boolean,
    error: boolean,
    errorMessage: string
    errorRule: string,
    files: FileList,
    pending: boolean,
    rule: string
    validated: string
    value: any
}

export interface FormControl {
    isControlledValidate: boolean
    checkInput: (input: InputStates, name: string, value: any, files: FileList | null) => void
}

export type ValidationRuleFunction = (value: any, params: string[], input: InputStates, allInputs: {
    [k: string]: InputStates
}, formControl: FormControl) => boolean

export type ValidationMessageFunction = (value: any, params: string[], input: InputStates, allInputs: {
    [k: string]: InputStates
}) => string

export interface ValidationRuleDefine<Rule = RegExp | ValidationRuleFunction | Promise<boolean>, ErrorMessageType = string | ValidationMessageFunction> {
    rule: Rule;
    message: {
        error: ErrorMessageType
    }
}

declare const defaultRules: {
    isEmail: ValidationRuleDefine<RegExp, string>;
    notEmpty: ValidationRuleDefine<ValidationRuleFunction, string>;
    minLength: ValidationRuleDefine<ValidationRuleFunction, string>;
    maxLength: ValidationRuleDefine<ValidationRuleFunction, string>;
    isNumeric: ValidationRuleDefine<RegExp, string>;
    isInt: ValidationRuleDefine<ValidationRuleFunction, string>;
    isAlpha: ValidationRuleDefine<RegExp, string>;
};

declare function HOCForm<P>(
    Component: React.ComponentType<P>
): React.ComponentType<P & FormValidateProps>;

declare function HOCInput<P>(
    Component: React.ComponentType
): React.ComponentType<P & InputValidateProps>;

export {HOCForm, HOCInput, defaultRules};
