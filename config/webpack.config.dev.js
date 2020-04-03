const path = require('path');

const packageName = require(path.resolve(process.cwd(), 'package.json')).name.split('@aryzing/').pop()

module.exports = {
  mode: "development",
  entry: path.resolve(process.cwd(), 'src/index.ts'),
  output: {
    filename: `${packageName}.js`,
    path: path.resolve(process.cwd(), 'dist'),
  },
  devServer: {
    /**
     * Webpack has a bug!
     * https://github.com/webpack/webpack-dev-server/issues/1604
     */
    disableHostCheck: true,
    /**
     * There is no need to serve static files from the cwd. Disabling to
     * avoid serving files accidentally.
     * https://webpack.js.org/configuration/dev-server/#devservercontentbase
     */
    contentBase: false,

    /**
     * Enable hot reloading. We don't need to add the
     * `webpack.HotModuleReplacementPlugin` because we're using Webpack Dev
     * Server. See
     * https://webpack.js.org/configuration/dev-server/#devserverhot
     */
    hot: true,

    /**
     * Set to a slightly less verbose mode that is generally preferred when
     * hot-reloading is enabled. This avoid spamming the console with too
     * much text on every reload.
     * https://webpack.js.org/configuration/dev-server/#devserverstats-
     * https://webpack.js.org/configuration/stats/
     */
    stats: 'errors-warnings',

    /**
     * Defaults to serving index.html when path on Webpack Dev Server does
     * not exist, a must for SPAs.
     * https://webpack.js.org/configuration/stats/
     */
    historyApiFallback: true,

    /**
     * Setting host to 0.0.0.0 so it can be accessed by other devices on the
     * network (i.e., other devices, peers reviewing your latest changes,
     * demo to client, etc).
     * https://webpack.js.org/configuration/dev-server/#devserverhost
     *
     * Webpack Dev Server will not respond to requests from other devices
     * when this option is set to the default 'localhost'. See
     * * https://github.com/webpack/webpack-dev-server/issues/147
     */
    host: '0.0.0.0',
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
  },
  watch: true
};