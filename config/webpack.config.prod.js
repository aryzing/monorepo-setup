const path = require('path');

const packageName = require(path.resolve(process.cwd(), 'package.json')).name.split('@aryzing/').pop()

module.exports = {
  mode: "production",
  entry: path.resolve(process.cwd(), 'src/index.ts'),
  output: {
    filename: `${packageName}.prod.min.js`,
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: "upward",
          }
        }
      }
    ],
  }
};