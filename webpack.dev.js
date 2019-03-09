const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  entry: ['webpack-hot-middleware/client?reload=true&quiet=true', './src/front/index.js'],
  output: {
    filename: '[name].[hash].js'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/front/index.html'
    })
  ]
})
