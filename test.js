import test from 'ava';
import mimicFn from '.';

const foo = function (bar) {
	return bar;
};

foo.unicorn = '🦄';

const symbol = Symbol('🦄');
foo[symbol] = '✨';

test('should return the wrapped function', t => {
	const wrapper = function () {};
	const returnValue = mimicFn(wrapper, foo);

	t.is(returnValue, wrapper);
});

test('should copy `name`', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo);

	t.is(wrapper.name, foo.name);
});

test('should copy other properties', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo);

	t.is(wrapper.unicorn, foo.unicorn);
});

test('should copy symbol properties', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo);

	t.is(wrapper[symbol], foo[symbol]);
});

test('should not copy `length`', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo);

	t.is(wrapper.length, 0);
});

test('should keep descriptors', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo);

	const properties = Reflect.ownKeys(foo).filter(property => property !== 'length');
	for (const property of properties) {
		// TODO: use `Object.getOwnPropertyDescriptors()` after dropping support for
		// Node 6
		t.deepEqual(
			Object.getOwnPropertyDescriptor(wrapper, property),
			Object.getOwnPropertyDescriptor(foo, property)
		);
	}
});
