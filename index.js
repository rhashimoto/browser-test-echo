// Jest doesn't honor the exports field in package.json, so this
// index.js file is fortunately found by default.
import { BrowserTestRunner } from './src/BrowserTestRunner.js';
export { BrowserTestRunner };
