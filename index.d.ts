declare const mimicFn: {
	/**
	Make a function mimic another one. It will copy over the properties `name`, `length`, `displayName`, and any custom properties you may have set.

	@param to - Mimicking function.
	@param from - Function to mimic.
	@param options - Options
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
	<
		ArgumentsType extends unknown[],
		ReturnType,
		FunctionType extends (...arguments: ArgumentsType) => ReturnType
	>(
		to: (...arguments: ArgumentsType) => ReturnType,
		from: FunctionType,
		options?: Options
	): FunctionType;

	// TODO: Remove this for the next major release, refactor the whole definition to:
	// declare function mimicFn<
	//	ArgumentsType extends unknown[],
	//	ReturnType,
	//	FunctionType extends (...arguments: ArgumentsType) => ReturnType
	// >(
	//	to: (...arguments: ArgumentsType) => ReturnType,
	//	from: FunctionType
	// ): FunctionType;
	// export = mimicFn;
	default: typeof mimicFn;
};

interface Options {
	/**
	 * Modify `Function.length`
	 *
	 * @default Use the same `Function.length`
	 */
	readonly length?: (length: number) => number;
}

export = mimicFn;
