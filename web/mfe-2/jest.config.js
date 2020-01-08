'use strict'

const baseConfig = require('../../config/jest.base')
const packageName = require('./package.json').name.split('@aryzing/').pop()
const config = {
  displayName: packageName,
  rootDir: '../..',
  roots: [
    `<rootDir>/web/${packageName}/src`,
  ],
}

module.exports = {
  ...baseConfig, 
  ...config
};
