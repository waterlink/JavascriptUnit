const JavascriptUnit = require("../src/JavascriptUnit");

function fizzBuzz(number) {
    if (number % 3 === 0 && number % 5 === 0) return "FizzBuzz";
    if (number % 3 === 0) return "Fizz";
    if (number % 5 === 0) return "Buzz";
    return number.toString();
}

function FizzBuzzTest(t) {
    this.testNormalNumber = function () {
        t.assertEqual("1", fizzBuzz(1));
    };

    this.testOtherNormalNumber = function () {
        t.assertEqual("2", fizzBuzz(2));
    };

    this.testFizzNumber = function () {
        t.assertEqual("Fizz", fizzBuzz(3));
    };

    this.testOtherFizzNumber = function () {
        t.assertEqual("Fizz", fizzBuzz(6));
    };

    this.testBuzzNumber = function () {
        t.assertEqual("Buzz", fizzBuzz(5));
    };

    this.testOtherBuzzNumber = function () {
        t.assertEqual("Buzz", fizzBuzz(10));
    };

    this.testFizzBuzzNumber = function () {
        t.assertEqual("FizzBuzz", fizzBuzz(15));
    };

    this.testOtherFizzBuzzNumber = function () {
        t.assertEqual("FizzBuzz", fizzBuzz(30));
    }
}

JavascriptUnit.addTestSuite(FizzBuzzTest);