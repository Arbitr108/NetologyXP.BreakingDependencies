/**
 * Created by asus on 25.01.2017.
 */
"use strict";
class TestPrinter {
    static print(state, ordersCount) {
        for (var i = 0; i < ordersCount; i++) {
            var productName = getSelectedItem();
            var price = calculatePriceFor(state, productName);
        }
        return i;
    }
}

module.exports = TestPrinter;