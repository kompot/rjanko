const os = require('os');
const path = require('path');
const webpack = require('webpack');
const StatsPlugin = require('rjanko/lib/statsPlugin');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');

const prod = process.env.NODE_ENV === 'production';

const autoPrefixerCfg = JSON.stringify({
  browsers: [
    'last 1 versions',
    'IE 11',
    'Opera 12.1'
  ]
});

var svgoConfig = JSON.stringify({
  plugins: [
    {removeTitle: true},
    {convertColors: {shorthex: false}},
    {convertPathData: false}
  ]
});

var config = {
  entry: {
    vendor: [
      // TODO keep this sorted
      'axios',
      'babel-runtime/core-js',
      'bluebird',
      'classnames',
      //'css-loader/cssToString',
      'debug',
      'jspath',
      'lodash',
      'react',
      'routr',
      'socket.io-client',
      'style-loader/addStyles',
      'moment',
      'flux-router-component/lib/History'
    ],
    app: ['./src/client']
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    publicPath: '/build/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      // axios requires `es6-promise` polyfill so we replace it with bluebird
      'es6-promise': 'bluebird'
    },
    extensions: ['', '.js']
  },
  bail: prod,
  node: {
    // used to get real filename for `debug`
    __filename: true
  },
  module: {
    loaders: [{
        test: /\.styl$/,
        loader:
          //  prod
          //? ExtractTextPlugin.extract('style', 'css!autoprefixer?' + autoPrefixerCfg + '!stylus')
          //:
            'style!css!autoprefixer?' + autoPrefixerCfg + '!stylus'
      }, {
        test: /\.css$/,
        loader:
          //  prod
          //? ExtractTextPlugin.extract('style', 'css')
          //:
            'style!css'
      }, {
        test: /\.(ttf|woff|woff2|eot|gif|png|jpg|mp3|mp4|webm|ogg)(\?.+)?$/,
        loader: 'file?name=[sha512:hash:base36:7].[ext]'
      }, {
        test: /src\/.+\.jsx?$/,
        exclude: /node_modules/,
        loaders: prod
            ? ['component-css?ext=styl', 'babel']
            : ['react-hot', 'component-css?ext=styl', 'babel']
      }, {
        test: /.*\.svg$/,
        loaders: ['file', 'svgo?' + svgoConfig]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
    }),
    //new webpack.optimize.DedupePlugin(),
    //new ExtractTextPlugin('[name].[contenthash].css', {
    //  allChunks: true
    //}),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new webpack.NoErrorsPlugin(),
    new StatsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  recordsPath: path.join(__dirname, '_records.json')
};

if (prod) {
  config.devtool = 'sourcemap';
  config.output.devtoolModuleFilenameTemplate = 'file://[resource-path]';
  config.output.devtoolFallbackModuleFilenameTemplate = 'file://[resource-path]?[hash]';

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({comments: /a^/, compress: {warnings: false}})
  );
} else {
  config.devtool = 'eval';

  for (const key in config.entry) {
    if (key !== 'vendor') {
      config.entry[key].unshift(
        'webpack-dev-server/client?http://127.0.0.1:3001',
        'webpack/hot/only-dev-server'
      );
    }
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
