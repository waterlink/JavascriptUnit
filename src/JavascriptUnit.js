const writeSync = require("fs").writeSync;

function JavascriptUnit(process, stats, errorFactory) {
    this.DEFAULT_ASSERT_TRUE_MESSAGE = "Expected condition to be true, got false";
    this.DEFAULT_ASSERT_FALSE_MESSAGE = "Expected condition to be false, got true";

    this.stats = stats;

    this.assertTrue = function (condition, errorMessage) {
        errorMessage = errorMessage || this.DEFAULT_ASSERT_TRUE_MESSAGE;

        if (!condition) {
            throw errorFactory.createError(errorMessage);
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

    this.assertJSONEqual = function (expected, actual) {
        var stringifiedExpected = JSON.stringify(expected);
        var stringifiedActual = JSON.stringify(actual);

        this.assertTrue(
            stringifiedExpected === stringifiedActual,
            "Expected to equal (as JSON) "
            + stringifiedExpected
            + " but got: "
            + stringifiedActual
        );
    };

    this.assertNotJSONEqual = function (expected, actual) {
        var stringifiedExpected = JSON.stringify(expected);
        var stringifiedActual = JSON.stringify(actual);

        this.assertTrue(
            stringifiedExpected !== stringifiedActual,
            "Expected not to equal (as JSON) "
            + stringifiedExpected
            + " but got: "
            + stringifiedActual
        );
    };

    this.assertThrows = function (expectedMessage, func) {
        var threw = true;

        try {
            func();
            threw = false;
        } catch (error) {
            if (error.message != expectedMessage) {
                throw errorFactory.createError("Expected error message '"
                    + expectedMessage + "', but was: '" + error.message + "'");
            }
        }

        if (!threw) {
            throw errorFactory.createError("Expected error message '"
                + expectedMessage + "', but no error have been thrown");
        }
    };

    this.log = function (message) {
        process.log(message);
    };

    this.error = function (message) {
        process.error(message);
    };
}

if (typeof module !== "undefined") {
    module.exports = JavascriptUnit;
}

function report(t) {
    t.log(
        "\n"
        + t.stats.passed + " tests passed, "
        + t.stats.failed + " failed."
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
    t.stats.failed += 1;
    logTestFailure(t, name, error);
}

function finalizeTestRun(t, process) {
    if (t.stats.failed > 0) {
        process.exit(1);
    }
}

function logTestPass(t, name) {
    t.log("\n" + name + ": OK");
}

function recordTestPass(t, name) {
    t.stats.passed += 1;
    logTestPass(t, name);
}

function recordTestStart(t) {
    t.stats.total += 1;
}

function runSetup(testSuite) {
    testSuite.setUp && testSuite.setUp();
}

function runTeardown(testSuite) {
    testSuite.tearDown && testSuite.tearDown();
}

function processTest(testSuite, name, t) {
    recordTestStart(t);

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

JavascriptUnit.addTestSuite = function (testSuiteConstructor, options) {
    options = options || {};
    var itsProcess = options.process || new NodeJSProcess();
    var itsStats = options.stats || JavascriptUnitStats;
    var itsErrorFactory = options.errorFactory || new StockErrorFactory();

    var t = new JavascriptUnit(itsProcess, itsStats, itsErrorFactory);

    runTestSuite(testSuiteConstructor, t);
    report(t);
    finalizeTestRun(t, itsProcess);
};

function NodeJSProcess() {
    this.log = function (message) {
        process.stdout.write(message + "\n");
    };

    this.error = function (message) {
        process.stderr.write(message + "\n");
    };

    this.exit = function (exitCode) {
        process.exit(exitCode);
    }
}

function StockErrorFactory() {
    this.createError = function (message) {
        return new Error(message);
    };
}

JavascriptUnit.createEmptyStats = function () {
    return {
        failed: 0,
        passed: 0,
        total: 0
    };
};

global.JavascriptUnitStats = JavascriptUnit.createEmptyStats();