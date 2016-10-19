'use strict';
module.exports = (to, from) => {
	if (from.name) {
		Object.defineProperty(to, 'name', {
			value: from.name,
			configurable: true
		});
	}

	Object.defineProperty(to, 'length', {
		value: from.length,
		configurable: true
	});

	if (from.displayName) {
		to.displayName = from.displayName;
	}

	// TODO: use `Reflect.ownKeys()` when targeting Node.js 6
	for (const prop of Object.getOwnPropertyNames(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}
};
