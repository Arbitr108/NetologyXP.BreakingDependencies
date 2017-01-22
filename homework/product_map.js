"use strict"
let Product = require("./product");
class ProductMap {
    constructor() {
        this._products = new Map();
    }

    add(name, product) {
        this._validate(product);
        this._products.set(name, product);
        return this;
    }

    get(name) {
        return this._products.get(name);
    }

    _validate(product) {
        if (!product instanceof Product)
            throw `${product} is not instance of Product`;
    }
}
module.exports = ProductMap;
