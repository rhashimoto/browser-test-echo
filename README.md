# browser-test-echo
For some web projects it is desirable to run unit tests in a browser instead
of an emulated environment like jsdom.
[Karma](https://karma-runner.github.io/latest/index.html) is the established
utility for this, but Karma bundles its own web server. Using a different
web server is possible (see the obsolete
[karma-esm](https://github.com/open-wc/open-wc/tree/master/packages/karma-esm))
but not easy.

Why would anyone want to use a specific web server? One reason is that some
web servers designed for development (e.g.
[Web Dev Server](https://modern-web.dev/docs/dev-server/overview/))
allow "buildless" workflows, i.e. bundling is not required until deployment.
There are pros and cons to this but many of the current cons are because
ES6 modules aren't universally supported, issues which should dwindle over
time.

This package provides two scripts that connect a standalone
[Jasmine](https://jasmine.github.io/pages/docs_home.html)
test in the browser and the test runner
[Jest](https://jestjs.io/).
It should be adaptable to most node test runners that support ES6 modules,
[Puppeteer](https://developers.google.com/web/tools/puppeteer),
and Jasmine (or Jasmine-like) test specs.

## Quick Start
* Use a recent version of nodejs (successfully tried v14.15.4).
* Clone the project and `yarn install`.
* Follow the
[instructions for enabling ES6 modules in Jest](https://jestjs.io/docs/en/ecmascript-modules)
which may involve setting NODE_OPTIONS in your environment.
* `yarn test`

The sample test should show two passing tests and one intentional
failing test. On a dumb terminal the results should look like this:
```
Web Dev Server started...

  Root dir: /home/dev/browser-test-echo
  Local:    http://localhost:8001/
  Network:  http://172.17.0.2:8001/

FAIL test/sample.test.js
  sample test suite
    ✓ should work
    nested test suite
      ✕ should show failed tests (like this one) (13 ms)
      ✓ should also work

  ● sample test suite › nested test suite › should show failed tests (like this one)

    expect(received).toBeFalsy()

    Received: "Error: Expected [ 1, 2, 3 ] to be 'a unicorn'.
        at <Jasmine>

      at UserContext.<anonymous> (http:/localhost:8001/test/sample.test.html:34:27)
          at <Jasmine>"
      at forEach (src/BrowserTestRunner.js:117:38)
          at Array.forEach (<anonymous>)
      at Object.<anonymous> (src/BrowserTestRunner.js:115:45)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        2.664 s, estimated 5 s
Ran all test suites.
```

## Usage
How to run browser tests from Jest in your project:

* Install this package as a dependency.

* Copy the test scripts - 
jest-setup.cjs, jest-teardown.cjs, and jest-environment.cjs -
into your own project and reference them in your jest.config.js.

* Use the sample files as models to create your own test.
   * [sample.test.js](https://github.com/rhashimoto/browser-test-echo/blob/master/test/sample.test.js) - Jest test that passes the Puppeteer browser and Jasmine Standalone test URL to this package.
   * [sample.test.html](https://github.com/rhashimoto/browser-test-echo/blob/master/test/sample.test.html) - Standalone browser test. You will need to alter the Jasmine Standalone script paths appropriately for your project.

## Caveats
ES6 module support is not complete or stable in Jest and Nodejs,
though steadily improving.

## Alternatives
Web Dev Server does have a companion
[Test Runner](https://modern-web.dev/docs/test-runner/overview/).
It is released and actively developed though it is not as mature as other
test runners.

Eventually [import maps](https://github.com/WICG/import-maps)
may standardize browser support for buildless workflows.
