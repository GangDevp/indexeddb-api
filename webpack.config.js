const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const pkg = require('./package');
const runEnv = pkg.runEnv;
const devEntry = pkg.devEntry;
const proEntry = pkg.proEntry;
const devServer = pkg.devServer;
const devPlugins = [
  new webpack.HotModuleReplacementPlugin()
];
const proPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: false
    }
  }),
  new CleanWebpackPlugin(['dist'])
];

const entryApp = runEnv === 'development' ? devEntry : proEntry;
const devtool = runEnv === 'development' ? 'inline-source-map' : 'none';
const plugins = runEnv === 'development' ? devPlugins : proPlugins;
plugins.push(new webpack.DefinePlugin({ 'process.env.NODE_ENV': runEnv }));


module.exports = {
  entry: entryApp,
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: devServer,
  devtool: devtool,
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: plugins
};