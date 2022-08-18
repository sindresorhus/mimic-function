# @esm2cjs/mimic-fn

This is a fork of https://github.com/sindresorhus/mimic-fn, but automatically patched to support ESM **and** CommonJS, unlike the original repository.

## Install

Use an npm alias to install this package under the original name:

```
npm i mimic-fn@npm:@esm2cjs/mimic-fn
```

```jsonc
// package.json
"dependencies": {
    "mimic-fn": "npm:@esm2cjs/mimic-fn"
}
```

## Usage

```js
// Using ESM import syntax
import mimicFunction from "mimic-fn";

// Using CommonJS require()
const mimicFunction = require("mimic-fn").default;
```

> **Note:**
> Because the original module uses `export default`, you need to append `.default` to the `require()` call.

For more details, please see the original [repository](https://github.com/sindresorhus/mimic-fn).

## Sponsoring

To support my efforts in maintaining the ESM/CommonJS hybrid, please sponsor [here](https://github.com/sponsors/AlCalzone).

To support the original author of the module, please sponsor [here](https://github.com/sindresorhus/mimic-fn).
