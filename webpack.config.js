const path = require('path');
const pkg = require('./package.json')

const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
});

const config = {
  entry: {
    index: './src/index.js',
  },
  context: __dirname,
  output: {
    path: '/build',
    filename: '[name].js',
    publicPath: '/dist',
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'reduxMe'),
        ],
        loader: 'babel-loader',
        options: babelConfig,
      },
    ],
  },
};

module.exports = config;
