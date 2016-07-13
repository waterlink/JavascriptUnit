const JavascriptUnit = require("../src/JavascriptUnit");

JavascriptUnit.addTestSuite(function JavascriptUnitTest(t) {
    this.testAssertTrue_withNoFailure = function () {
        t.assertTrue(true);
    };

    this.testAssertTrue_withDefaultErrorMessage = function () {
        t.assertThrows(t.DEFAULT_ASSERT_TRUE_MESSAGE, function () {
            t.assertTrue(false);
        });
    };

    this.testAssertTrue_withCustomErrorMessage = function () {
        var expectedMessage = "an expected error message";

        t.assertThrows(expectedMessage, function () {
            t.assertTrue(false, expectedMessage);
        });
    };

    this.testAssertFalse_withNoFailure = function () {
        t.assertFalse(false);
    };

    this.testAssertFalse_withDefaultErrorMessage = function () {
        t.assertThrows(t.DEFAULT_ASSERT_FALSE_MESSAGE, function () {
            t.assertFalse(true);
        });
    };

    this.testAssertFalse_withCustomErrorMessage = function () {
        var expectedMessage = "some other expected error message";

        t.assertThrows(expectedMessage, function () {
            t.assertFalse(true, expectedMessage);
        });
    };

    this.testAssertEqual_withNoFailure = function () {
        t.assertEqual(42, 42);
    };

    this.testAssertEqual_withFailure = function () {
        t.assertThrows("Expected to equal 5 but got: 42", function () {
            t.assertEqual(5, 42);
        });
    };

    this.testAssertNotEqual_withNoFailure = function () {
        t.assertNotEqual(5, 42);
    };

    this.testAssertNotEqual_withFailure = function () {
        t.assertThrows("Expected not to equal 5 but got: 5", function () {
            t.assertNotEqual(5, 5);
        });
    };

    this.testAssertThrows_withNoFailure = function () {
        var expectedMessage = "an expected error message";

        t.assertThrows(expectedMessage, function () {
            throw new Error(expectedMessage);
        });
    };

    this.testAssertThrows_withWrongMessage = function () {
        var expectedMessage = "an expected error message";
        var actualMessage = "some other non-relevant error message";

        var expectedFailure = "Expected error message '"
            + expectedMessage + "', but was: '" + actualMessage + "'";

        t.assertThrows(expectedFailure, function () {
            t.assertThrows(expectedMessage, function () {
                throw new Error(actualMessage);
            });
        });
    };

    this.testAssertThrows_withWrongMessage = function () {
        var shouldNotBeReached = false;

        var expectedMessage = "an expected error message";

        var expectedFailure = "Expected error message '"
            + expectedMessage + "', but no error have been thrown";

        t.assertThrows(expectedFailure, function () {
            t.assertThrows(expectedMessage, function () {});
            shouldNotBeReached = true;
        });

        if (shouldNotBeReached) {
            throw new Error("t.assertThrows(...) does not work correctly");
        }
    };
});