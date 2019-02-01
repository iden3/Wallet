const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config.js');

// some libraries look for process.env.NODE_ENV to optimize and webpack doesn't include it
const environmentPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('development'),
});

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    publicPath: '/',
    port: 8800,
    stats: 'normal',
    watchContentBase: true,
    historyApiFallback: true,
    hot: true,
  },
  plugins: [
    environmentPlugin,
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
  ],
});
