`HOCInput` is the optional higher order component. 
If you know to work with React context you can rewrite it to work best with your app. 
Even though the component is good enough and you shouldn't rewrite it.

## Required props

`HOCInput` has some props that required to start

* `name` {String} Name of the input
* `rule` {String} Normal validation rules 
* `asyncRule` {String} Promise validation rule
* `defaultValue` {Any} Default value of the input

Example 

```javascript


<Input      
  name="userName"
  defaultValue="abc"
  rule="notEmpty|minLength,4"
  asyncRule="asyncTestTrue,2000"
/>

```

## Props send to wrapped component

`HOCInput` will wrap your component and send these props to your input component


* `lang` {String} Language receive from the `HOCForm`
* `submitted` {Boolean} If the form submitting or not. We can use this to disable the form
* `validated` {Boolean} Check if the input is validated or not
* `value` {Any} The current value of the input
* `dirty` {Boolean} Check if the input is modified value
* `error` {Boolean} Check if the input fail the validation
* `pending` {Boolean} Check if the input is validating.
* `errorMessage` {String} Current error message of the input
* `defaultValue` {Any} Default value from props
* `name` {String} Name of the input
* `onBlur` {Function} Handler when user focus out the input
* `onChange` {Function} Handler when user change the value of the input

Please see the example source to understand how to integrate with `HOCInput` 

