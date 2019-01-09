const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  mode: 'production',
  entry: {
    app: [
      './dev/index',
    ],
  },

  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'demo-[hash].js',
  },

  module: {

    rules: [
      { test: /\.js|jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /(\.css)$/,
        use: ['style-loader', 'css-loader?sourceMap&modules=true&localIdentName=[name]__[local]___[hash:base64:8]', 'postcss-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new CleanWebpackPlugin(['./demo'], {
      root: process.cwd(),
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false,
    //   comments: false,
    //   compress: {
    //     warnings: false,
    //     drop_console: false,
    //   },
    //   mangle: {
    //     except: ['$'],
    //     screw_ie8: true,
    //   },
    //   sourceMap: true,
    // }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './index.html',
    }),
  ],
};

module.exports = config;
