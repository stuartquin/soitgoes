var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var ROOT = path.resolve(__dirname);
var IS_DEV = JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'));

var plugins = [
  new webpack.DefinePlugin({
    __DEV__: IS_DEV,
    __USERNAME__: JSON.stringify(process.env.USERNAME || null),
    __PASSWORD__: JSON.stringify(process.env.PASSWORD || null)
  }),
  new ExtractTextPlugin("main.css")
];

var entry = [
  './src/index'
];
if (IS_DEV) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  devtool: 'eval',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    alias: {
      components: ROOT + '/src/components',
      modules: ROOT + '/src/modules',
      services: ROOT + '/src/services'
    }
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]--[local]--[hash:6]"
            }
          }]
        })
      }
    ]
  }
};
