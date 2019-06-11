# mimic-fn [![Build Status](https://travis-ci.org/sindresorhus/mimic-fn.svg?branch=master)](https://travis-ci.org/sindresorhus/mimic-fn)

> Make a function mimic another one

Useful when you wrap a function in another function and like to preserve the original name and other properties.


## Install

```
$ npm install mimic-fn
```


## Usage

```js
const mimicFn = require('mimic-fn');

function foo() {}
foo.unicorn = '🦄';

function wrapper() {
	return foo();
}

console.log(wrapper.name);
//=> 'wrapper'

mimicFn(wrapper, foo);

console.log(wrapper.name);
//=> 'foo'

console.log(wrapper.unicorn);
//=> '🦄'
```


## API

It will copy over the properties `name`, `length`, `displayName`, and any custom properties you may have set.

### mimicFn(to, from, options?)

Modifies the `to` function and returns it.

#### to

Type: `Function`

Mimicking function.

#### from

Type: `Function`

Function to mimic.

#### options

Type: `object`

##### length

Type: `Function`

Modifies the function's `length` property. Useful when `from` and `to` do not
have the same number of arguments. This happens for example when binding or
currying.

```js
const mimicFn = require('mimic-fn');

const identity = value => value;
const getTrue = identity.bind(null, true);

mimicFn(getTrue, identity, { length: len => len - 1 });
console.log(getTrue.name);
//=> 'identity'

console.log(identity.length);
//=> 1

console.log(getTrue.length);
//=> 0
```

## Related

- [rename-fn](https://github.com/sindresorhus/rename-fn) - Rename a function
- [keep-func-props](https://github.com/ehmicky/keep-func-props) - Wrap a function without changing its name, length and other properties


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
