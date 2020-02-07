const baseConfig = require('../../config/jest.base')
const packageName = require('./package.json.js').name.split('@aryzing/').pop()
const config = {
  displayName: packageName,
  rootDir: '../..',
  roots: [
    `<rootDir>/packages/${packageName}/src`,
  ],
}

module.exports = {
  ...baseConfig, 
  ...config
};
