import test from 'ava';
import mimickFn from '.';

test('main', t => {
	const symbol = Symbol('🦄');

	function foo(bar) {} // eslint-disable-line no-unused-vars
	foo.unicorn = '🦄';
	foo[symbol] = '✨';

	function wrapper() {}

	t.is(foo.name, 'foo');

	t.is(mimickFn(wrapper, foo), wrapper);

	t.is(wrapper.name, 'foo');
	t.is(wrapper.length, 0);
	t.is(wrapper.unicorn, '🦄');
	t.is(wrapper[symbol], '✨');
});
