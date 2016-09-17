var path = require('path');
var webpack = require('webpack');

var IS_DEV = JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'));

var plugins = [
  new webpack.DefinePlugin({
    __DEV__: IS_DEV,
    __USERNAME__: JSON.stringify(process.env.USERNAME || null),
    __PASSWORD__: JSON.stringify(process.env.PASSWORD || null)
  })
];

var entry = [
  './src/index'
];
if (IS_DEV) {
  plugins.push(new webpack.HotModuleReplacementPlugin());

  entry.push('webpack-dev-server/client?http://localhost:3000');
  entry.push('webpack/hot/only-dev-server');
}

module.exports = {
  devtool: 'eval',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.css$/,
      loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
    }]
  }
};
