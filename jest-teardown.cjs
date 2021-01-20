const fs = require('fs');
const os = require('os');
const path = require('path');

const PACKAGE_NAME = require('./package.json').name;
const SETUP_PATH = path.join(os.tmpdir(), `jest_setup_${PACKAGE_NAME.replace(/[/]/g, '$')}`);

module.exports = async function () {
  // Halt web-dev-server and browser if started by jest.
  if (global.__BROWSER_GLOBAL__) {
    await global.__BROWSER_GLOBAL__.close();
  }
  await global.__SERVER_GLOBAL__.stop();

  fs.unlinkSync(SETUP_PATH);
};
