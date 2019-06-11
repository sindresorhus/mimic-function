'use strict';

const shouldCopyProperty = property => property !== 'length';

const mimicFn = (to, from) => {
	const props = Reflect.ownKeys(from).filter(shouldCopyProperty);

	for (const prop of props) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports.default = mimicFn;
