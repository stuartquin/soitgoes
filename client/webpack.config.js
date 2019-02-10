var path = require('path');
var webpack = require('webpack');

var ROOT = path.resolve(__dirname);
var IS_DEV = JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'));

var paths = {
  appSrc: path.join(__dirname, 'src'),
  appNodeModules: path.join(__dirname, 'node_modules'),
};

var plugins = [
  new webpack.DefinePlugin({
    __DEV__: IS_DEV,
    __USERNAME__: JSON.stringify(process.env.USERNAME || null),
    __PASSWORD__: JSON.stringify(process.env.PASSWORD || null)
  }),
  // Add module names to factory functions so they appear in browser profiler.
  new webpack.NamedModulesPlugin(),
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
  // This is necessary to emit hot updates (currently CSS only):
  new webpack.HotModuleReplacementPlugin(),
];

console.log('PATHS', paths);

function srcPath(subdir) { return path.join(__dirname, "src", subdir);}

module.exports = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules],
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      modules: srcPath('modules'),
      components: srcPath('components'),
      services: srcPath('services'),
    },
  },
  plugins: plugins,
  module: {
    strictExportPresence: true,
    rules: [{
      // "oneOf" will traverse all following loaders until one will
      // match the requirements. When no loader matches it will fall
      // back to the "file" loader at the end of the loader list.
      oneOf: [
        {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
      {
        // Exclude `js` files to keep "css" loader working as it injects
        // it's runtime that would otherwise processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.js$/, /\.html$/, /\.json$/],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      ]
    }]
  },
  performance: {
    hints: false,
  },
};
