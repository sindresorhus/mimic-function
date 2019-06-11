'use strict';

// If `to` has properties that `from` does not have, remove them
const removeProperty = (to, from, property) => {
	if (property in from) {
		return;
	}

	const {configurable, writable} = Object.getOwnPropertyDescriptor(to, property);

	if (configurable) {
		delete to[property];
	} else if (writable) {
		to[property] = undefined;
	}
};

const shouldCopyProperty = property => property !== 'length';

const mimicFn = (to, from) => {
	const properties = Reflect.ownKeys(from).filter(shouldCopyProperty);

	for (const property of properties) {
		Object.defineProperty(to, property, Object.getOwnPropertyDescriptor(from, property));
	}
	
	for (const property of Reflect.ownKeys(to)) {
		removeProperty(to, from, property)
	}

	return to;
};

module.exports = mimicFn;
