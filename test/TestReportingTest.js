const JavascriptUnit = require("../src/JavascriptUnit");

JavascriptUnit.addTestSuite(function TestReportingTest(t) {
    var itsProcess = new MockProcess(t);
    var itsStats = JavascriptUnit.createEmptyStats();

    var options = {
        process: itsProcess,
        stats: itsStats,
        errorFactory: new MockErrorFactory()
    };

    function suiteWithOneFailure() {
        JavascriptUnit.addTestSuite(function (t) {
            this.testThatFails = function () {
                t.assertTrue(false, "this is going to fail");
            };
        }, options);
    }

    function suiteWithOnePass() {
        JavascriptUnit.addTestSuite(function (t) {
            this.testThatPasses = function () {
                t.assertTrue(true, "this is going to pass");
            };
        }, options);
    }

    function suiteWithOnePassAndOneFailure() {
        JavascriptUnit.addTestSuite(function (t) {
            this.testThatPasses = function () {
                t.assertTrue(true, "this is going to pass");
            };

            this.testThatFails = function () {
                t.assertTrue(false, "this is going to fail");
            };
        }, options);
    }

    this.testExitCodeIsOne_whenOneTestFails = function () {
        suiteWithOneFailure();
        itsProcess.verifyExitedWithCode(1);
    };

    this.testExitCodeIsZero_whenOneTestPasses = function () {
        suiteWithOnePass();
        itsProcess.verifyExitedWithCode(0);
    };

    this.testExitCodeIsOne_whenOneTestPasses_andOneTestFails = function () {
        suiteWithOnePassAndOneFailure();
        itsProcess.verifyExitedWithCode(1);
    };

    this.testHasCorrectStats_whenOneTestFails = function () {
        suiteWithOneFailure();
        t.assertJSONEqual({failed: 1, passed: 0, total: 1}, itsStats);
    };

    this.testHasCorrectStats_whenOneTestPasses = function () {
        suiteWithOnePass();
        t.assertJSONEqual({failed: 0, passed: 1, total: 1}, itsStats);
    };

    this.testHasCorrectStats_whenOneTestPasses_andOneTestFails = function () {
        suiteWithOnePassAndOneFailure();
        t.assertJSONEqual({failed: 1, passed: 1, total: 2}, itsStats);
    };

    this.testHasCorrectStdout_whenOneTestPasses_andOneTestFails = function () {
        suiteWithOnePassAndOneFailure();
        t.assertJSONEqual(
            "\n" +
            "testThatPasses: OK\n" +
            "\n" +
            "1 tests passed, 1 failed.\n",
            itsProcess.stdout
        );
    };

    this.testHasCorrectStderr_whenOneTestPasses_andOneTestFails = function () {
        suiteWithOnePassAndOneFailure();
        t.assertJSONEqual(
            "\n" +
            "testThatFails: FAILURE\n" +
            "\tthis is going to fail\n" +
            "\n" +
            ".. stacktrace ..\n",
            itsProcess.stderr
        );
    };
});

function MockProcess(t) {
    var actualExitCode = 0;

    this.stdout = "";
    this.stderr = "";

    this.log = function (message) {
        this.stdout += message + "\n";
    };

    this.error = function (message) {
        this.stderr += message + "\n";
    };

    this.exit = function (exitCode) {
        actualExitCode = exitCode;
    };

    this.verifyExitedWithCode = function (expectedExitCode) {
        t.assertTrue(
            actualExitCode === expectedExitCode,
            "Expected process to exit with exit code "
            + expectedExitCode
            + " but got: "
            + actualExitCode
        );
    };
}

function MockErrorFactory() {
    this.createError = function (message) {
        var error = new Error(message);
        error.stack = ".. stacktrace ..";
        return error;
    };
}