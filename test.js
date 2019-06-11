import test from 'ava';
import mimicFn from '.';

const {hasOwnProperty} = Object.prototype;

const foo = function (bar) {
	return bar;
};

foo.unicorn = '🦄';

const symbol = Symbol('🦄');
foo[symbol] = '✨';

const parent = function () {};
parent.inheritedProp = true;
Object.setPrototypeOf(foo, parent);

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

test('should copy inherited properties', t => {
	const wrapper = function () {};
	mimicFn(wrapper, foo);

	t.is(wrapper.inheritedProp, foo.inheritedProp);
});

test('should delete extra configurable writable properties', t => {
	const wrapper = function () {};
	wrapper.extra = true;
	mimicFn(wrapper, foo);

	t.false(hasOwnProperty.call(wrapper, 'extra'));
});

test('should set to undefined extra non-configurable writable properties', t => {
	const wrapper = function () {};
	Object.defineProperty(wrapper, 'extra', {value: true, configurable: false, writable: true});
	mimicFn(wrapper, foo);

	t.true(hasOwnProperty.call(wrapper, 'extra'));
	t.is(wrapper.extra, undefined);
});

test('should skip extra non-configurable non-writable properties', t => {
	const wrapper = function () {};
	Object.defineProperty(wrapper, 'extra', {value: true, configurable: false, writable: false});
	mimicFn(wrapper, foo);

	t.is(wrapper.extra, true);
});

test('should not copy prototypes', t => {
	const wrapper = function () {};
	const prototype = {};
	wrapper.prototype = prototype;
	mimicFn(wrapper, foo);

	t.is(wrapper.prototype, prototype);
});

test('should allow classes', t => {
	class wrapperClass {}
	class fooClass {}
	mimicFn(wrapperClass, fooClass);

	t.is(wrapperClass.name, fooClass.name);
	t.not(wrapperClass.prototype, fooClass.prototype);
});
