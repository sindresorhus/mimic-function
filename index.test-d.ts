import {expectType, expectAssignable} from 'tsd';
import mimicFunction from './index.js';

function foo(string: string) {
	return false;
}

foo.unicorn = '🦄';

function wrapper(string: string) {
	return foo(string);
}

const mimickedFunction = mimicFunction(wrapper, foo);
expectAssignable<typeof foo & {unicorn: string}>(mimickedFunction);
expectType<boolean>(mimickedFunction('bar'));
expectType<string>(mimickedFunction.unicorn);
