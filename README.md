# front-end-unit-testing

Included are some front-end unit test samples for form-saver.js.  As a background, form-saver binds form input elements to localStorage by name so that those are prepopulated if revisiting the page, they also update if another page changes the stored value in real-time.

As there aren't really any meaty algorithms to test, most of the focus is on the DOM behavior.  DOM is constructed on beforeEach and torn down on afterEach.  We can test behavior by mocking events, which happens in test-utilities.js.

Tests are run via karma.  After installing the package ("npm install" in root) you should be able to use "karma start" to open a browser and run the tests.  Browser-based tests are preferred over something like PhantomJS because it actually tests the browser environment.  For example, form-saver uses several ES2015 features that won't work with IE.

#Tips

* Use sinon to stub things like framework calls or other methods that require more than trivial setup
* Sometimes with DOM templating and events you won't get the expected result because it hasn't rendered yet, you can use a setTimeout of 0 to wait until another event loop just incase.
* Be careful about tearing down properly, in this case form-saver needs a destroy method so it doesn't leave event listeners that are still around in subsequent tests, in the real-world it may not need a destructor type method.
* Use the optional message parameters on assertions, it gives better feedback when things break, especially when there are multiple assertions.
* Try not to assert too much in a test, one per test is ideal.
* Tests should be atomic and run in any order, everything you need should be created and destroyed in the test run
* Use the assertions appropriately as they give feedback, assert.ok for booleans, assert.equal for strings (not assert.ok(value == "string1")) etc.
* Testing naming and assertion style should be agreed upon by team before going forward (TDD vs BDD).  The example is written in TDD.
