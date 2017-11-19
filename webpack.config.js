const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "style.css"
});

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: ['./index.js', "./index.scss"],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
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
      exclude : /node_modules/,
      use : {
        loader : 'babel-loader'
      }
    }]
  },
  plugins : [
    extractSass,
    new HtmlWebpackPlugin({
      title: "volumen",
      template : "./index.html"
    })
  ]
};
