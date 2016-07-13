const writeSync = require("fs").writeSync;

global.JavascriptUnitGlobals = {
    failed: 0,
    passed: 0,
    total: 0
};

module.exports = function () {
    this.DEFAULT_ASSERT_TRUE_MESSAGE = "Expected condition to be true, got false";
    this.DEFAULT_ASSERT_FALSE_MESSAGE = "Expected condition to be false, got true";

    this.assertTrue = function (condition, errorMessage) {
        errorMessage = errorMessage || this.DEFAULT_ASSERT_TRUE_MESSAGE;

        if (!condition) {
            throw new Error(errorMessage);
        }
    };

    this.assertFalse = function (condition, errorMessage) {
        errorMessage = errorMessage || this.DEFAULT_ASSERT_FALSE_MESSAGE;

        this.assertTrue(!condition, errorMessage);
    };

    this.assertEqual = function (expected, actual) {
        this.assertTrue(
            expected === actual,
            "Expected to equal "
            + expected.toString()
            + " but got: "
            + actual.toString()
        )
    };

    this.assertNotEqual = function (expected, actual) {
        this.assertTrue(
            expected !== actual,
            "Expected not to equal "
            + expected.toString()
            + " but got: "
            + actual.toString()
        );
    };

    this.assertThrows = function (expectedMessage, func) {
        var threw = true;

        try {
            func();
            threw = false;
        } catch (error) {
            if (error.message != expectedMessage) {
                throw new Error("Expected error message '"
                    + expectedMessage + "', but was: '" + error.message + "'");
            }
        }

        if (!threw) {
            throw new Error("Expected error message '"
                + expectedMessage + "', but no error have been thrown");
        }
    };

    this.log = function (message) {
        process.stdout.write(message + "\n");
    };

    this.error = function (message) {
        process.stderr.write(message + "\n");
    };
};

function report(t) {
    t.log(
        "\n"
        + JavascriptUnitGlobals.passed + " tests passed, "
        + JavascriptUnitGlobals.failed + " failed."
    );
}

function runTest(testSuite, name) {
    testSuite[name]();
}

function logTestFailure(t, name, error) {
    t.error("\n" + name + ": FAILURE");
    t.error("\t" + error.message + "\n");
    t.error(error.stack);
}

function recordTestFailure(t, name, error) {
    JavascriptUnitGlobals.failed += 1;
    logTestFailure(t, name, error);
}

function finalizeTestRun() {
    if (JavascriptUnitGlobals.failed > 0) {
        process.exit(1);
    }
}

function logTestPass(t, name) {
    t.log("\n" + name + ": OK");
}

function recordTestPass(t, name) {
    JavascriptUnitGlobals.passed += 1;
    logTestPass(t, name);
}

function recordTestStart() {
    JavascriptUnitGlobals.total += 1;
}

function runSetup(testSuite) {
    testSuite.setUp && testSuite.setUp();
}

function runTeardown(testSuite) {
    testSuite.tearDown && testSuite.tearDown();
}

function processTest(testSuite, name, t) {
    recordTestStart();

    try {
        runSetup(testSuite);
        runTest(testSuite, name);
        recordTestPass(t, name);
    } catch (error) {
        recordTestFailure(t, name, error);
    } finally {
        runTeardown(testSuite);
    }
}

function isTestMethod(name) {
    return name.match(/^test/);
}

function processTestSuiteProperty(name, testSuite, t) {
    if (isTestMethod(name)) {
        processTest(testSuite, name, t);
    }
}

function runTestSuite(testSuiteConstructor, t) {
    var testSuiteExample = new testSuiteConstructor(t);

    for (var name in testSuiteExample) {
        //noinspection JSUnfilteredForInLoop
        processTestSuiteProperty(name, new testSuiteConstructor(t), t);
    }
}

module.exports.addTestSuite = function (testSuiteConstructor) {
    var t = new module.exports();

    runTestSuite(testSuiteConstructor, t);
    report(t);
    finalizeTestRun();
};