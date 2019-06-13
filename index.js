'use strict';

const {hasOwnProperty} = Object.prototype;

const copyProperty = (to, from, property, {ignoreNonConfigurable = false}) => {
	// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
	// `Function#prototype` is non-writable and non-configurable so can never be modified.
	if (property === 'length' || property === 'prototype') {
		return;
	}

	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
		return;
	}

	Object.defineProperty(to, property, fromDescriptor);
};

// `Object.defineProperty()` throws if the property exists, is not configurable and either:
//  - one its descriptors is changed
//  - it is non-writable and its value is changed
const canCopyProperty = function (toDescriptor, fromDescriptor) {
	return toDescriptor === undefined || toDescriptor.configurable || (
		toDescriptor.writable === fromDescriptor.writable &&
		toDescriptor.enumerable === fromDescriptor.enumerable &&
		toDescriptor.configurable === fromDescriptor.configurable &&
		(toDescriptor.writable || toDescriptor.value === fromDescriptor.value)
	);
};

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

const mimicFn = (to, from, options = {}) => {
	for (const property of Reflect.ownKeys(from)) {
		copyProperty(to, from, property, options);
	}

	changePrototype(to, from);

	for (const property of Reflect.ownKeys(to)) {
		removeProperty(to, from, property);
	}

	return to;
};

module.exports = mimicFn;
