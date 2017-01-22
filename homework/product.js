"use strict";
class Product {
    constructor(price, type) {
        this._price = price;
        this._type = type;
    }

    hasType(type) {
        return this._type === type;
    }
    getType() {
        return this._type;
    }

    getPrice() {
        return this._price;
    }
}
module.exports = Product;