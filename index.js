'use strict';

const mimicFn = (to, from, {length: getLength} = {}) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, getFuncProp(from, prop, getLength));
	}

	return to;
};

const getFuncProp = (func, prop, getLength) => {
	const descriptor = Object.getOwnPropertyDescriptor(func, prop);

	if (prop === 'length' && getLength !== undefined) {
		return getLengthProp(descriptor, getLength);
	}

	return descriptor;
};

// The function `length` can be changed with the `length` option, which is a
// function that takes the function `length` as input and returns it.
const getLengthProp = (descriptor, getLength) => {
	if (typeof getLength !== 'function') {
		return descriptor;
	}

	const newLength = getLength(descriptor.value);

	if (!Number.isInteger(newLength)) {
		return descriptor;
	}

	const value = Math.max(0, newLength);
	return Object.assign({}, descriptor, {value});
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports.default = mimicFn;
