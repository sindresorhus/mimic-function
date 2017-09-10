import test from 'ava';
import m from './';

test(t => {
	const symbol = Symbol('🦄');

	function foo(bar) {} // eslint-disable-line no-unused-vars
	foo.unicorn = '🦄';
	foo[symbol] = '✨';

	function wrapper() {
		return 1;
	}

	t.is(foo.name, 'foo');

	m(wrapper, foo);

	t.is(wrapper.name, 'foo');
	t.is(wrapper.length, 1);
	t.is(wrapper.unicorn, '🦄');
	t.is(wrapper[symbol], '✨');

	const expected =
	`/* function wrapper() {
		return 1;
	} */ 
	function foo(bar) {}`;

	t.is(wrapper.toString(), expected);
});
