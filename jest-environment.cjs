// This file is specified in jest.config.js to provide the jest test
// environment. 
const fs = require('fs');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const NodeEnvironment = require('jest-environment-node');

const PACKAGE_NAME = require('./package.json').name;
const SETUP_PATH = path.join(os.tmpdir(), `jest_setup_${PACKAGE_NAME.replace(/[/]/g, '$')}`);

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();

    // Access the info from jest-setup.js.
    const setupString = fs.readFileSync(SETUP_PATH);
    const { serverURL, wsEndpoint } = JSON.parse(setupString);

    // Provide additional globals to tests.
    this.global.__SERVER__ = serverURL;
    this.global.__PUPPETEER__ = await puppeteer.connect({
      // slowMo: 250,
      // devtools: true,
      browserWSEndpoint: wsEndpoint
    });
  }

  async teardown() {
    await this.global.__PUPPETEER__.disconnect();
    await super.teardown();
  }
}

module.exports = PuppeteerEnvironment;