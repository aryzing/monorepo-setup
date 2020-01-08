'use strict'

const baseConfig = require('./config/jest.base')
const config = {
  // Run tests from one or more projects
  projects: ["<rootDir>/packages/*/jest.config.js", "<rootDir>/web/*/jest.config.js"],
}

module.exports = {
  ...baseConfig, 
  ...config
};
