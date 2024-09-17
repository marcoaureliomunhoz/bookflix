const { resolve } = require('path');
const root = resolve(__dirname);
const aliases = require('./aliases.json');

const config = {
  rootDir: root,
  displayName: 'Entities Tests',
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/app/__tests__/entities/**/*.test.ts']
};

config.moduleNameMapper = {};

aliases.forEach((alias) => {
  config.moduleNameMapper[alias.jestconfig.alias] = alias.jestconfig.path;
});

module.exports = config;
