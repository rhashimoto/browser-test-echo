import path from 'path';
import { URL } from 'url';
import { BrowserTestRunner } from 'browser-test-echo';

function buildURL(testToFilePath) {
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  const rootToTestPath = path.relative(process.cwd(), dirname);
  return `${global.__SERVER__}/${rootToTestPath}/${testToFilePath}`;
}

await BrowserTestRunner.testHTML(global.__PUPPETEER__, buildURL('sample.test.html'));
