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

## Usage
TBD

## Alternatives
Web Dev Server does have a companion
[Test Runner](https://modern-web.dev/docs/test-runner/overview/).
It is released and actively developed though it is not as mature as other
test runners.

Eventually [import maps](https://github.com/WICG/import-maps)
may standardize browser support for buildless workflows.
