import test from 'ava';
import m from './';

test(t => {
	function foo(bar) {} // eslint-disable-line no-unused-vars
	foo.unicorn = '🦄';

	function wrapper() {}

	t.is(foo.name, 'foo');

	m(wrapper, foo);

	t.is(wrapper.name, 'foo');
	t.is(wrapper.length, 1);
	t.is(wrapper.unicorn, '🦄');
});
