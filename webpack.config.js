const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

require('@babel/register')

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sass|scss)$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV || 'PRODUCTION')
    }),
    new HtmlWebpackPlugin({
      title: 'Dima Zuzin',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      minify: {
        collapseWhitespace: true
      },
      inlineSource: '.(js|css)$' // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 9000
  }
}
