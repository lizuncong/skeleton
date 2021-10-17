const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SkeletonPlugin = require('./plugins/SkeletonPlugin')

module.exports = {
  mode: 'development',
  devtool: "false",
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            },
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new SkeletonPlugin({
      staticDir: path.resolve(__dirname, 'dist'),
      port: 8000,
      origin: 'http://localhost:8000',
      device: 'iPhone 6',
      defer: 5000,
      button: {
        color: '#efefef'
      },
      image: {
        color: '#efefef'
      }
    })
  ]
}
