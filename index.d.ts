import * as React from "react";


export interface FormValidateProps {
    validateLang?: string;
    submitCallback?: (a: any, b: any) => void;
    errorCallback?: () => void;
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

declare const defaultRules: any;

declare function HOCForm<P>(
    Component: React.ComponentType<P>
): React.ComponentType<P & FormValidateProps>;

declare function HOCInput<P>(
    Component: React.ComponentType
): React.ComponentType<P & InputValidateProps>;

export { HOCForm, HOCInput, defaultRules };


