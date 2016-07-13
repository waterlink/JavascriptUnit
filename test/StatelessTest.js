const JavascriptUnit = require("../src/JavascriptUnit");

JavascriptUnit.addTestSuite(function StatelessTest(t) {
    var answerOfTheUniverse;

    this.setUp = function () {
        answerOfTheUniverse = 42;
    };

    this.testAnswerIsCorrect = function () {
        t.assertEqual(42, answerOfTheUniverse);
    };

    this.testAnswerCanBeChanged = function () {
        answerOfTheUniverse = 43;
        t.assertEqual(43, answerOfTheUniverse);
    };

    this.testAnswerIsResetBack = function () {
        t.assertEqual(42, answerOfTheUniverse);
    };
});