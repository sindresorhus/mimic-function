/**
Modifies the `to` function to mimic the `from` function. Returns the `to` function.

`name`, `displayName`, and any other properties from `from` are copied. The `length` property is not copied. Properties present in `to` but not in `from` are deleted.

@param to - Mimicking function.
@param from - Function to mimic.
@returns The modified `to` function.

@example
```
import mimicFn = require('mimic-fn');

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
*/
declare function mimicFn<
	ArgumentsType extends unknown[],
	ReturnType,
	FunctionType extends (...arguments: ArgumentsType) => ReturnType
>(
	to: (...arguments: ArgumentsType) => ReturnType,
	from: FunctionType
): FunctionType;

export = mimicFn;
