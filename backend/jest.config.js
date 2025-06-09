const globalSetup = require("./tests/globalSetup");

module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/globalTeardown.js',
  //setupFilesAfterEnv: ['<rootDir>/tests/setupAfterEnv.js']
}