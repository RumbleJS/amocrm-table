// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',  // Entry point for your application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  mode: 'development', // Can also be 'production' or 'none'
  module: {
    rules: [
      {
        test: [/\.js$/, /\.css$/],
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader', {
          loader: 'babel-loader',
        }],
      },
    ],
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),  // Polyfill for browser
    },
  },
};
