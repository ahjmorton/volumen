const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "style.css"
});

const distDir = 'dist';

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: [
   'babel-polyfill',
    './index.js', 
    "./index.scss"
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, distDir)
  },
  module : {
    rules : [{
      test : /\.scss$/,
      use: extractSass.extract({
        use: [{
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }],
        fallback: "style-loader"
      })
    }, {
      test : /\.js$/,
      loader : 'babel-loader',
      exclude : /node_modules/,
      query : {
        presets : ['es2015']
      }
    }]
  },
  plugins : [
    new CleanWebpackPlugin([distDir]),
    extractSass,
    new HtmlWebpackPlugin({
      title: "volumen",
      template : "./index.html"
    })
  ]
};
