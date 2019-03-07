import {expectType} from 'tsd-check';
import mimicFn from '.';

function foo(string: string) {
	return false;
}
foo.unicorn = '🦄';

function wrapper(string: string) {
	return foo(string);
}

const mimickedFn = mimicFn(wrapper, foo);

expectType<typeof foo & {unicorn: string}>(mimickedFn);

expectType<boolean>(mimickedFn('bar'));
expectType<string>(mimickedFn.unicorn);
