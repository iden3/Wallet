const path = require('path');
// remove/clean build folder(s) before building
const CleanWebpackPlugin = require('clean-webpack-plugin');
// generates an HTML5 file for you that includes all your webpack bundles in the body using script tags
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Plugins definition
const cleanWebPackPlugin = new CleanWebpackPlugin(['./dist']);
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
});

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    filename: 'js/i3-web-wallet.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    sourceMapFilename: '[name].js.map',
  },
  resolve: {
    alias: {
      helpers: path.resolve(__dirname, './src/helpers/'),
      base_components: path.resolve(__dirname, './src/components/'),
      constants: path.resolve(__dirname, './src/constants/'),
      dal: path.resolve(__dirname, './src/dal/dal.js'),
      app_context: path.resolve(__dirname, './src/app-context.js'),
      fixtures: path.resolve(__dirname, './src/fixtures'),
      hocs: path.resolve(__dirname, './src/hocs/'),
      schemas: path.resolve(__dirname, './src/schemas/'),
      state: path.resolve(__dirname, './src/state/'),
      static: path.resolve(__dirname, './static/'),
      static_fonts: path.resolve(__dirname, './static/fonts/'),
      static_images: path.resolve(__dirname, './static/images/'),
      store: path.resolve(__dirname, './src/store/'),
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
        test: /\.(jpe?g|png|gif|svg|ico|url)$/i,
        exclude: /node_modules/,
        loader: 'url-loader?limit=8192&name=images/[name].[ext]',
      },
      {
        test: /\.(ttf|eot|svg|woff2?)(\?v=[a-z0-9=\.]+)?$/i,
        exclude: /node_modules/,
        loader: 'url-loader?limit=8192&name=fonts/[name].[ext]',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Adds CSS to the DOM by injecting a <style> tag --> https://github.com/webpack-contrib/style-loader
          // fallback to style-loader in development
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
                './src/styles/_palette.scss',
                './src/styles/_variables.scss',
                './src/styles/_mixins.scss',
              ],
            },
          },
        ],
      },
      // this rule is only to override global variables of antd framework that is made with LeSS
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            modifyVars: {
              'font-family': '"Barlow Light", Lato, sans-serif !important',
              'font-size-base': '16px',
            },
            javascriptEnabled: true,
          },
        }],
      }],
  },
  plugins: [
    cleanWebPackPlugin,
    htmlWebpackPlugin,
  ],
  node: { fs: 'empty' }, // so we don't trigger errors when a library is using fs, i.e.
};
