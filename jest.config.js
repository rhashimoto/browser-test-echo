/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  globalSetup: './jest-setup.cjs',
  globalTeardown: './jest-teardown.cjs',
  testEnvironment: './jest-environment.cjs',

  moduleFileExtensions: ["js", "mjs"],
  testMatch: [ '**/*.test.?(m)js' ]
};
