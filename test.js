import test from 'ava';
import m from './';

test(t => {
	const symbol = Symbol('🦄');

	function foo(bar) {} // eslint-disable-line no-unused-vars
	foo.unicorn = '🦄';
	foo[symbol] = '✨';

	function wrapper() {}

	t.is(foo.name, 'foo');

	t.is(m(wrapper, foo), wrapper);

	t.is(wrapper.name, 'foo');
	t.is(wrapper.length, 1);
	t.is(wrapper.unicorn, '🦄');
	t.is(wrapper[symbol], '✨');
});
