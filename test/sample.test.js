import path from 'path';
import { URL } from 'url';
import { BrowserTestRunner } from 'browser-test-echo';

// Converts a file path relative to this script file to a URL.
function buildURL(testToFilePath) {
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  const rootToTestPath = path.relative(process.cwd(), dirname);
  return `${global.__SERVER__}/${rootToTestPath}/${testToFilePath}`;
}

await BrowserTestRunner.testHTML(global.__PUPPETEER__, buildURL('sample.test.html'));
