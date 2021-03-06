[![Build Status](https://travis-ci.org/gndplayground/react-hoc-form-validatable.svg?branch=master)](https://travis-ci.org/gndplayground/react-hoc-form-validatable)
[![Coverage Status](https://coveralls.io/repos/github/gndplayground/react-hoc-form-validatable/badge.svg?branch=master)](https://coveralls.io/github/gndplayground/react-hoc-form-validatable?branch=master)
[![dependencies Status](https://david-dm.org/gndplayground/react-hoc-form-validatable/status.svg)](https://david-dm.org/gndplayground/react-hoc-form-validatable)

## Most important news
### v0.7.0
#### `Breaking changes`: 
- Props dirty now only equal to true when the new value is !== old value (shallow compare). 
Before v0.7.0 prop dirty equal to true when on change new value, form submit.

### v0.6.0
- Fix change default value no re validate input. 
- Add onUnRegistered, onRegistered callback for HOCInput.

### v0.5.6
- Filter unwanted props to HOCInput children.
- Improve typescript d.ts.

### v0.5.0
- Remove babel-cli as dep
- Use new context react api. So from 0.5.0 will require react > 16.3.0

### v0.4.0
- `validateLang` now is optional props in HOCForm
- `cancelablePromise` fix unhandled reject promise. `cancelablePromise` now only use internally. Async rules no need to use `cancelablePromise`.
- Now support multiple async rules.
- Added `errorAsyncRuleCallback` to handle errors in async rules. 
- Partial support typescript (need improve more)

## Intro

`react-hoc-form-validatable` is a library has a higher order form and input components that help validate form easily, 
especially with asynchronous validate come from the server with the help of Promise ES6.

The library aim to create a validatable component that easy to work with any other input components. 
So you can make your own form components with your own styling.

## Install 

`npm -i react-hoc-form-validatable`

or

`yarn add react-hoc-form-validatable`

## Demo
[Demo online](https://gndplayground.github.io/react-hoc-form-validatable)

## Docs

You should check [the docs](https://github.com/gndplayground/react-hoc-form-validatable/tree/master/docs) and [the demo source](https://github.com/gndplayground/react-hoc-form-validatable/tree/master/dev/examples)  
to see how to use it.

## Notes

The library requires Promise polyfill by your app if you want to use asynchronous validation (It mean the 
Promise polyfill is not shipped with the library). Your Promise polyfill has to support Promise.cancel(). 
For that, you can use BlueBird or use the wrapper that provided in this library. 

The library uses `Higher Order Component` technique and React context to make it possible. 

Before use this library you should have knowledge about Higher Order Component. 

About React context you should understand it if you want to create your own 
HOC Input Component.

Your Input Component should be controlled component. 
Meaning the form validate will pass the value to the input. See the definition [here](https://www.sitepoint.com/video-controlled-vs-uncontrolled-components-in-react/)
