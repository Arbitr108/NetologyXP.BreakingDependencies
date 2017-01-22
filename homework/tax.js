"use strict"
class Tax {
    constructor(base, multiplierMap) {
        this._base = base;
        this._multipliers = multiplierMap;
    }

    getBase() {
        return this._base;
    }

    getMultiplier(product_type) {
        return this._multipliers.get(product_type);
    }
}
module.exports = Tax;
