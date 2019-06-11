import test from 'ava';
import mimicFn from '.';

const symbol = Symbol('🦄');

const foo = function (bar) {
	return bar;
};

foo.unicorn = '🦄';
foo[symbol] = '✨';

test('main', t => {
	t.is(foo.name, 'foo');

	const wrapper = function () {};
	t.is(mimicFn(wrapper, foo), wrapper);

	t.is(wrapper.name, 'foo');
	t.is(wrapper.length, 1);
	t.is(wrapper.unicorn, '🦄');
	t.is(wrapper[symbol], '✨');
});

test('should keep descriptors', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo);

	// TODO: use `Object.getOwnPropertyDescriptors()` after dropping support for
	// Node 6
	for (const prop of Reflect.ownKeys(foo)) {
		t.deepEqual(
			Object.getOwnPropertyDescriptor(wrapper, prop),
			Object.getOwnPropertyDescriptor(foo, prop)
		);
	}
});

test('"length" option: should set function length', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo, {length: len => len + 1});

	t.is(wrapper.length, 2);
});

test('"length" option: should keep descriptors', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo, {length: len => len});

	t.deepEqual(
		Object.getOwnPropertyDescriptor(wrapper, 'length'),
		Object.getOwnPropertyDescriptor(foo, 'length')
	);
});

test('"length" option: should fix negative function length', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo, {length: len => len - 2});

	t.is(wrapper.length, 0);
});

test('"length" option: should ignore non-integer function length', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo, {length: () => NaN});

	t.is(wrapper.length, 1);
});

test('`length` option: should ignore if not a function', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo, {length: 2});

	t.is(wrapper.length, 1);
});
