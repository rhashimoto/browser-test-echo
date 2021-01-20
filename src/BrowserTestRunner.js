import assert from 'assert';

// This class can be used by a nodejs test runner to extract standalone
// Jasmine events from a web page (via Puppeteer) and recreate the remote
// test structure and results for the local test runner.
export class BrowserTestRunner {
  // Typical usage will call this static function with a Puppeteer browser
  // instance and the HTML test file URL. Note that top-level await
  // (flagged in node 14.3, unflagged in 14.8) and ES6 modules must be
  // used to allow tests to be specified asynchronously.
  // https://github.com/facebook/jest/issues/2235#issuecomment-585195125
  static async testHTML(browser, testURL) {
    const runner = new BrowserTestRunner();
    await runner.openPage(browser, testURL);
    const events = await runner.getBrowserEvents();
    await runner.closePage();

    const fn = runner.compileBrowserEvents(events);
    fn();
  }

  constructor() {
    this._page = null;
    this._pageErrorCount = 0;
  }

  async openPage(browser, testURL) {
    assert(!this._page);
    this._page = await browser.newPage();

    // Handle page events.
    this._page.on('console', async msg => {
      const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
      console.log.apply(null, args);
    });
    this._page.on('pageerror', error => {
      ++this._pageErrorCount;
      console.error(error.message);
    });
    this._page.on('requestfailed', request => {
      ++this._pageErrorCount;
      console.error(request.failure().errorText, request.url());
    });

    // Navigate to the test page.
    await this._page.goto(testURL, {
      // https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8a10828149e0
      waitUntil: 'networkidle0'
    });

    return this._page;
  }

  async getBrowserEvents() {
    // Make sure to fail if the browser tests are broken.
    assert(this._page);
    if (this._pageErrorCount) {
      assert.fail(`error(s) on page, check log`);
    }

    // Extract the events saved by the custom reporter.
    return this._page.evaluate(() => getJasmineEvents());
  }

  async closePage() {
    await this._page.close();
    this._page = null;
  }

  compileBrowserEvents(events) {
    return this._parseSuite(events);
  }

  // This utility function returns a function that defines a suite. The
  // outermost jasmineStarted/jasmineDone block is treated as a suite for
  // which describe() is *not* called.
  _parseSuite(events) {
    const fnArray = [];
    const callFnArray = () => fnArray.forEach(fn => fn());

    let event;
    while (event = events.shift()) {
      switch (event.type) {
        case 'jasmineStarted':
          break;
        case 'suiteStarted':
          fnArray.push(this._parseSuite(events));
          break;
        case 'specStarted':
          fnArray.push(this._parseSpec(events));
          break;
        case 'suiteDone':
          return () => {
            describe(event.data.description, callFnArray);
          };
        case 'jasmineDone':
          return callFnArray;
        default:
          assert.fail(`unexpected event ${event.type}`);
      }
    }
  }

  // This utility function returns a function that defines a spec, i.e.
  // an it() call. The Jest spec will fail whenever the corresponding
  // browser Jasmine spec fails.
  _parseSpec(events) {
    let event;
    while (event = events.shift()) {
      switch (event.type) {
        case 'specDone':
          return () => {
            it(event.data.description, () => {
              expect(true).toBeTruthy(); // Avoid empty spec warning.
              event.data.failedExpectations.forEach(failed => {
                // See reported argument for actual error/stack in browser.
                expect(failed.stack).toBeFalsy();
              });
            });
          };
        default:
          assert.fail(`unexpected event ${event.type}`);
      }
    }
  }
};
