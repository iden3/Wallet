const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// create a CSS file per JS file which contains CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// optimize and minimize the CSS
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');

// some libraries look for process.env.NODE_ENV to optimize and webpack doesn't include it
const environmentPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
});
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: '[name].[hash].css',
  chunkFilename: '[id].[hash].css',
});

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true to have JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    miniCssExtractPlugin,
    environmentPlugin,
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // to resolve css files
            options: {
              // make CSS modular, class name will be scoped locally and specific to only the component in question
              modules: true,
              importLoaders: 1,
              // to configure the generated identification: [name of the component]_[name of class/id]_[random unique hash]
              localIdentName: '[name]_[local]_[hash:base64]',
              sourceMap: true,
              minimize: true,
            },
          },
          // Loads a Sass/SCSS file and compiles it to CSS
          'sass-loader',
        ],
      },
    ],
  },
});
