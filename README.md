# JavascriptUnit

xUnit-style testing framework for Javascript.

## Creating a test suite

```javascript
// file: test/FizzBuzzTest.js
require("/path/to/JavascriptUnit").addTestSuite(function FizzBuzzTest(t) {
    this.testNormalNumber = function() {
        t.assertEqual("4", fizzBuzz(4));
    };

    this.testFizzNumber = function() {
        t.assertEqual("Fizz", fizzBuzz(3));
    };

    this.testBuzzNumber = function() {
        t.assertEqual("Buzz", fizzBuzz(5));
    };
});
```

## Running the test suite

```bash
node test/FizzBuzzTest.js
```

Output:

```
testNormalNumber: OK

testFizzNumber: OK

testBuzzNumber: FAILURE
	Expected to equal Buzz but got: 5

Error: Expected to equal Buzz but got: 5
    .. stacktrace ..
    at FizzBuzzTest.testBuzzNumber (./test/FizzBuzzTest.js:12:11)
    .. stacktrace ..

2 tests passed, 1 failed.
```

*NOTE: test suite object is created for each single test function. So do not worry about any state, that is stored inside of this object, it will not pollute any other tests.*

## Assertions

### `assertTrue(condition, [message])`

Fails if `condition` is falsey. Uses `message` as an error message if provided.

Example:

```javascript
assertTrue(acme.isItLeanEnough());
assertTrue(acme.isItLeanEnough(), "acme should be lean enough");
```

### `assertFalse(condition, [message])`

Fails if `condition` is truthy. Uses `message` as an error message if provided.

Example:

```javascript
assertFalse(acme.isItLeanEnough());
assertFalse(acme.isItLeanEnough(), "acme should not be lean enough");
```

### `assertEqual(expected, actual)`

Fails if `expected !== actual`.

Example:

```javascript
assertEqual(42, getAnswerOfTheUniverse());
```

### `assertNotEqual(expected, actual)`

Fails if `expected === actual`.

Example:

```javascript
assertNotEqual("invalid value", getTheValue());
```

### `assertJSONEqual(expected, actual)`

Fails if `JSON.stringify(expected) !== JSON.stringify(actual)`. Useful for comparing serialize-able data-structures.

Example:

```javascript
assertJSONEqual({name: "John", hobby: "Open Source Contributor"}, getUser());
```

### `assertNotJSONEqual(expected, actual)`

Fails if `JSON.stringify(expected) === JSON.stringify(actual)`. Useful for comparing serialize-able data-structures.

Example:

```javascript
assertNotJSONEqual({name: "Sarah", hobby: "Electronic Music Composer"}, getUser());
```

### `assertThrows(expectedMessage, func)`

Calls `func()` and asserts, that:

1. `func()` threw an exception.
2. Error message was exactly `expectedMessage`.

Example:

```javascript
assertThrows("Unable to reach the server", function () {
    connectToServer();
});
```

## Setup & Teardown

Setup and tear-down is done by implementing optional `this.setUp()` and `this.tearDown()`, respectively, functions on test suite. For example:

```javascript
require("/path/to/JavascriptUnit").addTestSuite(function ExampleTest(t) {
    this.setUp = function() {
        // .. do any necessary setup here ..
    };

    this.tearDown = function() {
        // .. do any necessary tear-down here ..
    };
});
```

## TODO

- [ ] Unit-test test-failure handling code.
- [ ] Compatibility with browser.
- [ ] Test-drive any serious Kata with it.
- [ ] Release on npm?
