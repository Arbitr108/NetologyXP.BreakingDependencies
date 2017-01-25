/**
 * Created by asus on 25.01.2017.
 */
"use strict";
class TestPrinter {
    print(state, ordersCount) {
        Printer.print(`----------${state}-----------`);
        for (var i = 0; i < ordersCount; i++) {
            var productName = getSelectedItem();
            var price = calculatePriceFor(state, productName);
            Printer.print(`${productName}: $${price.toFixed(2)}`);
        }
        Printer.print(`----Have a nice day!-----`);
    }
}