const path = require('path');
// remove/clean build folder(s) before building
const CleanWebpackPlugin = require('clean-webpack-plugin');
// generates an HTML5 file for you that includes all your webpack bundles in the body using script tags
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Plugins definition
const cleanWebPackPlugin = new CleanWebpackPlugin(['./dist']);
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      base_components: path.resolve(__dirname, './src/components/'),
      constants: path.resolve(__dirname, './src/constants/'),
      fixtures: path.resolve(__dirname, './src/fixtures'),
      hocs: path.resolve(__dirname, './src/hocs/'),
      state: path.resolve(__dirname, './src/state/'),
      static: path.resolve(__dirname, './static/'),
      static_fonts: path.resolve(__dirname, './static/fonts/'),
      static_images: path.resolve(__dirname, './static/images/'),
      store: path.resolve(__dirname, './src/store/'),
      helpers: path.resolve(__dirname, './src/helpers/'),
      test_helpers: path.resolve(__dirname, './__tests__/utils/helpers.js'),
      views: path.resolve(__dirname, './src/views/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot|url\.svg)(\?.+)?$/,
        loader: 'url-loader?limit=8192&name=[name].[ext]',
      },
    ],
  },
  plugins: [
    cleanWebPackPlugin,
    htmlWebpackPlugin,
  ],
};
