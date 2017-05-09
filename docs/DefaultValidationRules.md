The library has default validation rules. You can extend it.

If the rule you want is missing you can create your own rule. Since the rules required for the form just a object.

If the rule you want is very basic and necessary for web, you can create pull request or ask me. 
```javascript
import {defaultRules} from 'react-hoc-form-validatable'

<FormDemoBasic 
    //...
    rules={defaultRules}
/>
```

## Rule list

### `isEmail`

Check if the value is a valid email address

```javascript
<Input
  //...
  rule="isEmail"
/>
```

### `notEmpty`

Check if the value is not empty

```javascript
<Input
  //...
  rule="notEmpty"
/>
```

### `minLength`

Check if the value length must be at least specify characters

```javascript
<Input
  //...
  rule="minLength,4"
/>
```

### `maxLength`

Check if the value length length must not be greater than specify characters

```javascript
<Input
  //...
  rule="maxLength,8"
/>
```

### `betweenLength`

Check if the value length length must between specify characters

```javascript
<Input
  //...
  rule="betweenLength,4,8"
/>
```

### `isNumeric`

Check if the value is numeric

```javascript
<Input
  //...
  rule="isNumeric"
/>
```

### `isAlpha`

Check if the value is alpha

```javascript
<Input
  //...
  rule="isAlpha"
/>
```