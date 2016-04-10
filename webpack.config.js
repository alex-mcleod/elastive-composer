var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './src/js/index.js'
  ],
  output: {
    path: './dist/',
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules', './src', './src/js'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: [
          'react-hot',
          'babel'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg)$/,
        loaders: [
          'url'
        ],
        query: {
          limit: 8192
        }
      }
    ]
  }
}
