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
  devtool: 'cheap-module-source-map',
  devServer: {
    // contentBase: './dist',
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    publicPath: '/',
    port: 9000,
    stats: 'minimal',
    watchContentBase: true,
    historyApiFallback: true,
  },
  plugins: [
    environmentPlugin,
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // we need it to create a style.[contenthash].css file when do a hot update of any SCSS file
    // since webpack (version 4.3) has a known problem about this. So each time we change a SCSS File
    // it'll generate a new hash, and we can see the changes
  ],
});
