'use strict';
/* eslint-disable prefer-arrow-callback */
module.exports = function (to, from) {
	Reflect.ownKeys(from).forEach(function (prop) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	});

	return to;
};
