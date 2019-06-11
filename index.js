'use strict';

// If `to` has properties that `from` does not have, remove them
const removeProperty = function (to, from, property) {
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
	const props = Reflect.ownKeys(from).filter(shouldCopyProperty);

	for (const prop of props) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	Reflect.ownKeys(to).forEach(property => removeProperty(to, from, property));

	return to;
};

module.exports = mimicFn;
