// Define custom reporter for Jasmine.
// https://jasmine.github.io/tutorials/custom_reporter
//
// This reporter saves Jasmine events so they can be retrieved with
// a global function, e.g. via Puppeteer.
window.getJasmineEvents = (function() {
  const results = new Promise(resolve => {
    const events = [];
    const reporter = {};
    [ "jasmineStarted", "jasmineDone",
      "suiteStarted",   "suiteDone",
      "specStarted",    "specDone" ].forEach(function(type) {
        reporter[type] = function(data) {
          events.push({ type, data });
          if (type === 'jasmineDone') resolve(events);
        };
      });
    jasmine.getEnv().addReporter(reporter);
  });
  return () => results;
})();
