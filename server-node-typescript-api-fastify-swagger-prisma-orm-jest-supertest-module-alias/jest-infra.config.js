const { resolve } = require('path');
const root = resolve(__dirname);
const aliases = require('./aliases.json');

const config = {
  rootDir: root,
  displayName: 'Infra Tests',
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/app/__tests__/_infra/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/app/__tests__/_infra/jest-setup.ts'],
  globalTeardown: '<rootDir>/app/__tests__/_infra/teardown.ts'
};

config.moduleNameMapper = {};

aliases.forEach((alias) => {
  config.moduleNameMapper[alias.jestconfig.alias] = alias.jestconfig.path;
});

module.exports = config;
