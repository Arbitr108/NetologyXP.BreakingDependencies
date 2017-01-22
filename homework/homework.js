"use strict";
var Product = require("./product");
var ProductType = require("./product_type");

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

let productMap = new ProductMap();
productMap
    .add("milk", new Product(5.5, ProductType.GROCERIES))
    .add("eggs", new Product(3.0, ProductType.GROCERIES))
    .add("coca-cola", new Product(3.0, ProductType.GROCERIES))
    .add("amoxicillin", new Product(3.0, ProductType.GROCERIES))
    .add("aspirin", new Product(3.0, ProductType.PRESCRIBED_DRUG))
    .add("marijuana", new Product(3.0, ProductType.PRESCRIBED_DRUG))
    .add("eghamburgergs", new Product(3.0, ProductType.PREPARED_FOOD))
    .add("ceasar salad", new Product(3.0, ProductType.PREPARED_FOOD));

//Products list
var items = {
    "milk": {price: 5.5, type: "Groceries"},
    "eggs": {price: 3.0, type: "Groceries"},
    "coca-cola": {price: 0.4, type: "Groceries"},
    "amoxicillin": {price: 6.7, type: "Groceries"},
    "aspirin": {price: 0.2, type: "PrescriptionDrug"},
    "marijuana": {price: 1.4, type: "PrescriptionDrug"},
    "hamburger": {price: 2, type: "PreparedFood"},
    "ceasar salad": {price: 4.2, type: "PreparedFood"},
};
//Tax multiplicators list
var itemTypes =
{
    "Groceries": {
        "Alabama": 0,
        "Alaska": 0,
        "Arizona": "",
        "Arkansas": 0.015,
        "California": "",
        "Colorado": "",
        "Connecticut": "",
        "Tennessee": 5,
        "Texas": 0
    },
    "PrescriptionDrug": {
        "Alabama": "",
        "Alaska": 0,
        "Arizona": "",
        "Arkansas": "",
        "California": "",
        "Colorado": "",
        "Connecticut": "",
        "Tennessee": "",
        "Texas": ""
    }
};
//Base taxes
function base(state) {
    var taxes = {
        "Alabama": 0.04,
        "Alaska": 0,
        "Arizona": 0.056,
        "Arkansas": 0.065,
        "California": 0.075,
        "Colorado": 0.029,
        "Connecticut": 0.0635,
        "Tennessee": 7,
        "Texas": 6.25
    };
    return taxes[state];
}
//Price calculation for products of non PreparedFood type
function calc(state, itemType) {

    var itemTypeTaxModifier = itemTypes[itemType];
    if (itemTypeTaxModifier[state] === "") {
        return 0;
    }
    return base(state) + itemTypeTaxModifier[state];
}

function calculatePriceFor(state, item) {
    var result = null;
    if (items[item].type === "PreparedFood") {
        result = ( 1 + base(state) ) * items[item].price;
    }
    else {
        result = calc(state, items[item].type) * items[item].price + items[item].price;
    }
    return result;
}
class TaxCalculator {
    // У этой функции нелья менять интерфейс
    // Но можно менять содержимое
    calculateTax() {
        var ordersCount = getOrdersCount();
        var state = getSelectedState();
        console.log(`----------${state}-----------`);
        for (var i = 0; i < ordersCount; i++) {
            var item = getSelectedItem();
            var result = calculatePriceFor(state, item);
            console.log(`${item}: $${result.toFixed(2)}`);
        }
        console.log(`----Have a nice day!-----`);
    }
}

//############################
//Production - код:
//calculateTaxes();

//############################
//Тесты:
var tests = [
    () => assertEquals(3.0 * (1 + 0.04), calculatePriceFor("Alabama", "eggs")),
    () => assertEquals(0.4 * (1 + 0.015 + 0.065), calculatePriceFor("Arkansas", "coca-cola")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("Alaska", "amoxicillin")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("California", "amoxicillin")),
    () => assertEquals(2 * (1 + 0.0635), calculatePriceFor("Connecticut", "hamburger")),
];

//Раскомментируйте следующую строчку для запуска тестов:
runAllTests(tests);

//############################
//Код ниже этой строчки не надо менять для выполнения домашней работы

function calculateTaxes() {
    var calculator = new TaxCalculator();
    calculator.calculateTax({isTestMode: false});
}

function getSelectedItem() {
    var items = ["milk", "eggs", "coca-cola", "amoxicillin", "aspirin", "marijuana", "hamburger", "ceasar salad"];
    return items[Math.floor(Math.random() * items.length)];
}

function getSelectedState() {
    var state = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut"];
    return state[Math.floor(Math.random() * state.length)];
}

function getOrdersCount() {
    return Math.floor(Math.random() * 3) + 1;
}

//############################
// Кустарный способ писать тесты

function assertEquals(expected, actual) {
    var epsilon = 0.000001;
    var difference = Math.abs(expected - actual);
    if (difference > epsilon || difference === undefined || isNaN(difference)) {
        console.error(`Fail! Expected: ${expected}, Actual: ${actual}`);
        return -1;
    }
    return 0;
}

function runAllTests(tests) {
    var failedTests = tests
        .map((f) => f())
        .map((code) => {
            if (code === -1) {
                return 1
            } else {
                return 0
            }
        })
        .reduce((a, b) => a + b, 0);

    if (failedTests === 0) {
        console.log(`Success: ${tests.length} tests passed.`);
    }
    else {
        console.error(`Fail: ${failedTests} tests failed.`);
    }
}