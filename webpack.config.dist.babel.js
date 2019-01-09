const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};
const reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom',
};

module.exports = {
  mode: 'production',
  entry: {
    cancelablePromise: './src/cancelablePromise.js',
    defaultRules: './src/defaultRules.js',
    HOCForm: './src/HOCForm.jsx',
    HOCInput: './src/HOCInput.jsx',
    'cancelablePromise.min': './src/cancelablePromise.js',
    'defaultRules.min': './src/defaultRules.js',
    'HOCForm.min': './src/HOCForm.jsx',
    'HOCInput.min': './src/HOCInput.jsx',
  },

  externals: {
    react: reactExternal,
    'react-dom': reactDOMExternal,
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: 'dist',
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'ReactHOCFormValidatable',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
  ],

  module: {
    rules: [
      { test: /\.js|jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
};

console.log(process.env.NODE_ENV);