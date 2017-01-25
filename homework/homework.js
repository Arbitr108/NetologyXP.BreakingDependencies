"use strict";
let Product = require("./product");
let ProductType = require("./product_type");
let ProductMap = require("./product_map");
let Tax = require("./tax");
let Printer = require("./printer");
let TestPrinter = require("./test_printer");

let productMap = new ProductMap();
productMap
    .add("milk", new Product(5.5, ProductType.GROCERIES))
    .add("eggs", new Product(3.0, ProductType.GROCERIES))
    .add("coca-cola", new Product(0.4, ProductType.GROCERIES))
    .add("amoxicillin", new Product(6.7, ProductType.GROCERIES))
    .add("aspirin", new Product(0.2, ProductType.PRESCRIBED_DRUG))
    .add("marijuana", new Product(1.4, ProductType.PRESCRIBED_DRUG))
    .add("hamburger", new Product(2, ProductType.PREPARED_FOOD))
    .add("ceasar salad", new Product(4.2, ProductType.PREPARED_FOOD));

let stateTaxMap = new Map();
stateTaxMap
    .set("Alabama", new Tax(0.04, new Map([["Groceries", 0], ["PrescriptionDrug", ""]])))
    .set("Alaska", new Tax(0, new Map([["Groceries", 0], ["PrescriptionDrug", 0]])))
    .set("Arizona", new Tax(0.056, new Map([["Groceries", ""], ["PrescriptionDrug", ""]])))
    .set("Arkansas", new Tax(0.065, new Map([["Groceries", 0.015], ["PrescriptionDrug", ""]])))
    .set("California", new Tax(0.075, new Map([["Groceries", ""], ["PrescriptionDrug", ""]])))
    .set("Colorado", new Tax(0.029, new Map([["Groceries", ""], ["PrescriptionDrug", ""]])))
    .set("Connecticut", new Tax(0.0635, new Map([["Groceries", ""], ["PrescriptionDrug", ""]])))
    .set("Tennessee", new Tax(7, new Map([["Groceries", 5], ["PrescriptionDrug", ""]])))
    .set("Texas", new Tax(6.25, new Map([["Groceries", 0], ["PrescriptionDrug", ""]])));

function calculatePriceFor(state, productName) {
    var product = productMap.get(productName);
    var productPrice = product.getPrice();
    var tax = stateTaxMap.get(state);

    if (product.hasType(ProductType.PREPARED_FOOD))
        return ( 1 + tax.getBase() ) * productPrice;

    var taxMultiplier = tax.getMultiplier(product.getType());

    if (taxMultiplier === "")
        return productPrice;
    else
        return (tax.getBase() + taxMultiplier) * productPrice + productPrice;
}

function createPrinter(mode) {
    if (mode && mode.isTestMode)
        return new TestPrinter();
    else
        return new Printer();
}

class TaxCalculator {
    // У этой функции нелья менять интерфейс
    // Но можно менять содержимое
    calculateTax() {
        let mode = this._getMode(arguments);
        var ordersCount = getOrdersCount(mode);
        var state = getSelectedState(mode);
        var TaxPrinter = createPrinter(mode);
        this._print(state, ordersCount, mode);
    }

    _print(state, ordersCount) {
        Printer.print(`----------${state}-----------`);
        for (var i = 0; i < ordersCount; i++) {
            var productName = getSelectedItem();
            var price = calculatePriceFor(state, productName);
            Printer.print(`${productName}: $${price.toFixed(2)}`);
        }
        Printer.print(`----Have a nice day!-----`);
    }

    _getMode(data) {
        let mode = {};
        if (data.length > 0) {
            mode = Array.prototype.slice.call(data)
                .reduce(function (parameter) {
                    return parameter.hasOwnProperty("isTestMode") ? parameter.isTestMode : null
                });
        }
        if (mode.hasOwnProperty("isTestMode") && mode.isTestMode == true)
            mode.testSettings = mode.testSettings || {};

        return mode;
    }
}

//############################
//Production - код:
calculateTaxes();

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
    calculator.calculateTax({isTestMode: true, ordersCount: 3, state: "Colorado"});
}

function getSelectedItem() {
    var items = ["milk", "eggs", "coca-cola", "amoxicillin", "aspirin", "marijuana", "hamburger", "ceasar salad"];
    return items[Math.floor(Math.random() * items.length)];
}

function getSelectedState(settings) {
    if (settings && settings.isTestMode && settings.state)
        return settings.state;
    var state = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut"];
    return state[Math.floor(Math.random() * state.length)];
}

function getOrdersCount(settings) {
    if (settings && settings.isTestMode && settings.ordersCount)
        return settings.ordersCount;
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