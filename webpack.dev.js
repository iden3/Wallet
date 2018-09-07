const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');

// some libraries look for process.env.NODE_ENV to optimize and webpack doesn't include it
const environmentPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('development'),
});

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: './dist',
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    environmentPlugin,
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // we need it to create a style.[contenthash].css file when do a hot update of any SCSS file
    // since webpack (version 4.3) has a known problem about this. So each time we change a SCSS File
    // it'll generate a new hash, and we can see the changes
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Adds CSS to the DOM by injecting a <style> tag --> https://github.com/webpack-contrib/style-loader
          'style-loader',
          // Interprets @import and url() like import/require() and will resolve them -->  https://github.com/webpack-contrib/css-loader
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              module: true,
              // to configure the generated identification: [name of the component]_[name of class/id]_[random unique hash]
              localIdentName: '[name]_[local]_[hash:base64]',
              sourceMap: true,
              minimize: true,
            },
          },
          // Loads a Sass/SCSS file and compiles it to CSS --> https://github.com/webpack-contrib/sass-loader
          'sass-loader',
          // @import SASS resources into every required SASS module --> https://github.com/shakacode/sass-resources-loader
          {
            loader: 'sass-resources-loader',
            options: {
              // Provide path to the file with resources
              resources: [
                './src/styles/_variables.scss',
                './src/styles/_mixins.scss',
              ],
            },
          },
        ],
      },
    ],
  },
});
