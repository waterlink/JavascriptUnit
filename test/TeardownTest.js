const JavascriptUnit = require("../src/JavascriptUnit");

var someGlobalValue = "initial value";

JavascriptUnit.addTestSuite(function TeardownTest(t) {
    this.tearDown = function () {
        someGlobalValue = "initial value";
    };

    this.testThatChangesStateOfTheWorld = function () {
        someGlobalValue = "oops";
        t.assertEqual("oops", someGlobalValue);
    };

    this.testChecksThatStateOfTheWorldIsResetBetweenTests = function () {
        t.assertEqual("initial value", someGlobalValue);
    };
});