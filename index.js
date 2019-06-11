'use strict';

const {hasOwnProperty} = Object.prototype;

const changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) {
		return;
	}

	Object.setPrototypeOf(to, fromPrototype);
};

// If `to` has properties that `from` does not have, remove them
const removeProperty = (to, from, property) => {
	if (hasOwnProperty.call(from, property)) {
		return;
	}

	const {configurable, writable} = Object.getOwnPropertyDescriptor(to, property);

	if (configurable) {
		delete to[property];
	} else if (writable) {
		to[property] = undefined;
	}
};

// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
// `Function#prototype` is non-writable and non-configurable so can never be modified.
const shouldCopyProperty = property => property !== 'length' && property !== 'prototype';

const mimicFn = (to, from) => {
	const properties = Reflect.ownKeys(from).filter(shouldCopyProperty);

	for (const property of properties) {
		Object.defineProperty(to, property, Object.getOwnPropertyDescriptor(from, property));
	}

	changePrototype(to, from);

	for (const property of Reflect.ownKeys(to)) {
		removeProperty(to, from, property);
	}

	return to;
};

module.exports = mimicFn;
