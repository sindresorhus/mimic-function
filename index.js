'use strict';

const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		const descriptor = Object.getOwnPropertyDescriptor(from, prop);
		if (descriptor.writable === true) {
			Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
		}
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports.default = mimicFn;
