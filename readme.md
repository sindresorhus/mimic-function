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

It will copy over the properties `name`, `displayName`, and any custom properties you may have set. The `length` property won't be copied.

### mimicFn(to, from)

Modifies the `to` function and returns it.

#### to

Type: `Function`

Mimicking function.

#### from

Type: `Function`

Function to mimic.


## Related

- [rename-fn](https://github.com/sindresorhus/rename-fn) - Rename a function
- [keep-func-props](https://github.com/ehmicky/keep-func-props) - Wrap a function without changing its name and other properties


---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-mimic-fn?utm_source=npm-mimic-fn&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
