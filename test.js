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

	const {length: fooLength, ...fooProperties} = Object.getOwnPropertyDescriptors(foo);
	const {length: wrapperLength, ...wrapperProperties} = Object.getOwnPropertyDescriptors(wrapper);
	t.deepEqual(fooProperties, wrapperProperties);
	t.notDeepEqual(fooLength, wrapperLength);
});

test('should delete extra configurable writable properties', t => {
	const wrapper = function () {};
	wrapper.extra = true;
	mimicFn(wrapper, foo);

	t.false('extra' in wrapper);
});

test('should delete extra non-configurable writable properties', t => {
	const wrapper = function () {};
	Object.defineProperty(wrapper, 'extra', {value: true, configurable: false, writable: true});
	mimicFn(wrapper, foo);

	t.true('extra' in wrapper);
	t.is(wrapper.extra, undefined);
});

test('should not delete extra non-configurable non-writable properties', t => {
	const wrapper = function () {};
	Object.defineProperty(wrapper, 'extra', {value: true, configurable: false, writable: false});
	mimicFn(wrapper, foo);

	t.true('extra' in wrapper);
	t.not(wrapper.extra, undefined);
});

test('should work with arrow functions', t => {
	const wrapper = function () {};
	wrapper.extra = true;
	const arrowFn = () => {};
	mimicFn(wrapper, arrowFn);

	t.is(wrapper.prototype, arrowFn.prototype);
});
