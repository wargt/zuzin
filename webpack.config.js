const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

require('@babel/register')

module.exports = {
  mode: 'production',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  entry: {
    main: './src/js/index.js'
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
      {
        test: /\.(png|jpg|gif|webp)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]?[hash]' }
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
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      inlineSource: '.(js|css)$' // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 9000
  }
}
