import test from 'ava';
import mimicFunction from './index.js';

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
	const returnValue = mimicFunction(wrapper, foo);

	t.is(returnValue, wrapper);
});

test('should copy `name`', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(wrapper.name, foo.name);
});

test('should copy other properties', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(wrapper.unicorn, foo.unicorn);
});

test('should copy symbol properties', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(wrapper[symbol], foo[symbol]);
});

test('should not copy `length`', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(wrapper.length, 0);
});

test('should keep descriptors', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	const {length: fooLength, toString: fooToString, ...fooProperties} = Object.getOwnPropertyDescriptors(foo);
	const {length: wrapperLength, toString: wrapperToString, ...wrapperProperties} = Object.getOwnPropertyDescriptors(wrapper);
	t.deepEqual(fooProperties, wrapperProperties);
	t.not(fooLength, wrapperLength);
	t.not(fooToString, wrapperToString);
});

test('should copy inherited properties', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(wrapper.inheritedProp, foo.inheritedProp);
});

test('should not delete extra configurable properties', t => {
	const wrapper = function () {};
	wrapper.extra = true;
	mimicFunction(wrapper, foo);

	t.true(wrapper.extra);
});

test('should not copy prototypes', t => {
	const wrapper = function () {};
	const prototype = {};
	wrapper.prototype = prototype;
	mimicFunction(wrapper, foo);

	t.is(wrapper.prototype, prototype);
});

test('should allow classes to be copied', t => {
	class wrapperClass {}
	class fooClass {}
	mimicFunction(wrapperClass, fooClass);

	t.is(wrapperClass.name, fooClass.name);
	t.not(wrapperClass.prototype, fooClass.prototype);
});

test('should patch toString()', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(wrapper.toString(), `/* Wrapped with wrapper() */\n${foo.toString()}`);
});

test('should patch toString() with arrow functions', t => {
	const wrapper = function () {};
	const arrowFunction = value => value;
	mimicFunction(wrapper, arrowFunction);

	t.is(wrapper.toString(), `/* Wrapped with wrapper() */\n${arrowFunction.toString()}`);
});

test('should patch toString() with bound functions', t => {
	const wrapper = function () {};
	const boundFunction = (() => {}).bind();
	mimicFunction(wrapper, boundFunction);

	t.is(wrapper.toString(), `/* Wrapped with wrapper() */\n${boundFunction.toString()}`);
});

test('should patch toString() with new Function()', t => {
	const wrapper = function () {};
	// eslint-disable-next-line no-new-func
	const newFunction = new Function('');
	mimicFunction(wrapper, newFunction);

	t.is(wrapper.toString(), `/* Wrapped with wrapper() */\n${newFunction.toString()}`);
});

test('should patch toString() several times', t => {
	const wrapper = function () {};
	const wrapperTwo = function () {};
	mimicFunction(wrapper, foo);
	mimicFunction(wrapperTwo, wrapper);

	t.is(wrapperTwo.toString(), `/* Wrapped with wrapperTwo() */\n/* Wrapped with wrapper() */\n${foo.toString()}`);
});

test('should keep toString() non-enumerable', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	const {enumerable} = Object.getOwnPropertyDescriptor(wrapper, 'toString');
	t.false(enumerable);
});

test('should print original function with Function.prototype.toString.call()', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(Function.prototype.toString.call(wrapper), 'function () {}');
});

test('should work with String()', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(String(wrapper), `/* Wrapped with wrapper() */\n${foo.toString()}`);
});

test('should not modify toString.name', t => {
	const wrapper = function () {};
	mimicFunction(wrapper, foo);

	t.is(wrapper.toString.name, 'toString');
});

test('should work when toString() was patched by original function', t => {
	const wrapper = function () {};
	const bar = function () {};
	bar.toString = () => 'bar.toString()';
	mimicFunction(wrapper, bar);

	t.is(wrapper.toString(), `/* Wrapped with wrapper() */\n${bar.toString()}`);
});

// eslint-disable-next-line max-params
const configurableTest = (t, shouldThrow, ignoreNonConfigurable, toDescriptor, fromDescriptor) => {
	const wrapper = function () {};
	Object.defineProperty(wrapper, 'conf', {
		value: true,
		configurable: false,
		writable: true,
		enumerable: true,
		...toDescriptor,
	});

	const bar = function () {};
	Object.defineProperty(bar, 'conf', {
		value: true,
		configurable: false,
		writable: true,
		enumerable: true,
		...fromDescriptor,
	});

	if (shouldThrow) {
		t.throws(() => {
			mimicFunction(wrapper, bar, {ignoreNonConfigurable});
		});
	} else {
		t.notThrows(() => {
			mimicFunction(wrapper, bar, {ignoreNonConfigurable});
		});
	}
};

configurableTest.title = title => `should handle non-configurable properties: ${title}`;

test('not throw with no changes', configurableTest, false, false, {}, {});
test('not throw with writable value change', configurableTest, false, false, {}, {value: false});
test('throw with non-writable value change', configurableTest, true, false, {writable: false}, {value: false, writable: false});
test('not throw with non-writable value change and ignoreNonConfigurable', configurableTest, false, true, {writable: false}, {value: false, writable: false});
test('throw with configurable change', configurableTest, true, false, {}, {configurable: true});
test('not throw with configurable change and ignoreNonConfigurable', configurableTest, false, true, {}, {configurable: true});
test('throw with writable change', configurableTest, true, false, {writable: false}, {writable: true});
test('not throw with writable change and ignoreNonConfigurable', configurableTest, false, true, {writable: false}, {writable: true});
test('throw with enumerable change', configurableTest, true, false, {}, {enumerable: false});
test('not throw with enumerable change and ignoreNonConfigurable', configurableTest, false, true, {}, {enumerable: false});
test('default ignoreNonConfigurable to false', configurableTest, true, undefined, {}, {enumerable: false});
