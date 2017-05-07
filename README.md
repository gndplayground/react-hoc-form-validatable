`react-hoc-form-validatable` is a library has a higher order form and input components that help validate form easily, 
especially with asynchronous validate come from the server with the help of Promise ES6.

The library requires Promise polyfill by your app if you want to use asynchronous validation (It mean the 
Promise polyfill is not shipped with the library). Your Promise polyfill has to support Promise.cancel(). 
For that, you can use BlueBird or use the wrapper that provided in this library. 

The library uses `Higher Order Component` technique and React context to make it possible. 

Before use this library you should have knowledge about Higher Order Component. 

About React context you should understand it to know how the input states flow through the form and custom your own higher order input component, but it's not mandatory. Higher Order Component should be enough.