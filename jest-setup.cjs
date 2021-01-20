const fs = require('fs');
const os = require('os');
const path = require('path');

const { startDevServer } = require('@web/dev-server');
const puppeteer = require('puppeteer');

// Specify a uniquely named temporary file to pass configuration info.
const PACKAGE_NAME = require('./package.json').name;
const SETUP_PATH = path.join(os.tmpdir(), `jest_setup_${PACKAGE_NAME.replace(/[/]/g, '$')}`);

module.exports = async function () {
  // Start a web-dev-server instance.
  const server = await startDevServer({
    config: {
      nodeResolve: true,
      preserveSymlinks: true,
    },
    readCliArgs: false
  });
  global.__SERVER_GLOBAL__ = server;

  // Start browser if an existing one is not specified.
  let browser = null;
  if (!process.env.PUPPETEER_ENDPOINT) {
    browser = await puppeteer.launch();
  }
  global.__BROWSER_GLOBAL__ = browser;

  // Pass info to TestEnvironment via the file system.
  fs.writeFileSync(
    SETUP_PATH,
    JSON.stringify({
      serverURL: `http://localhost:${server.server.address().port}`,
      wsEndpoint: process.env.PUPPETEER_ENDPOINT || browser.wsEndpoint()
    }));
};
