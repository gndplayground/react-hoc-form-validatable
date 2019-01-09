const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {

  entry: {
    app: [
      './dev/index',
    ],
  },

  mode: 'development',

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js|jsx?$/,
        loaders: [
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              emitWarning: true,
            },
          },
        ],
        exclude: /node_modules/,
        include: [path.join(__dirname, 'dev'), path.join(__dirname, 'lib')],
      },
      { test: /\.js|jsx$/, exclude: /node_modules/, use: 'babel-loader' },
      {
        test: /(\.css)$/,
        use: ['style-loader', 'css-loader?sourceMap&modules=true&localIdentName=[name]__[local]___[hash:base64:8]', 'postcss-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  devtool: 'cheap-module-inline-source-map',

  devServer: {
    stats: 'errors-only',
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    // new webpack.NamedModulesPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('development'),
    //   },
    // }),
  ],
};

module.exports = config;
