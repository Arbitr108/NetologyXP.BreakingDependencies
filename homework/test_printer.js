/**
 * Created by asus on 25.01.2017.
 */
"use strict";
class TestPrinter {
    constructor() {
        this.spyCounter = 0;
    }

    getCounter() {
        return this.spyCounter;
    };

}

module.exports = TestPrinter;