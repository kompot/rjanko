var os = require('os');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
//var StatsPlugin = require('rjanko/lib/statsPlugin');

var prod = process.env.NODE_ENV === 'production';

var nodeModules = {
  "./webpack.config.js": "./webpack.config.js"
};

fs.readdirSync('node_modules')
    .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });

var config = {
  entry: {
    server: [
      './src/server2.js'
    ]
  },
  output: {
  //  //path: path.join(__dirname, 'build-server'),
    libraryTarget: 'commonjs',
    filename: '[name].js'
  },
  //externals: ['./webpack.config.js'].concat(fs.readdirSync("node_modules").map(function(m) {
  //  return m;
  //})),
  externals: nodeModules,
  resolve: {
    //alias: {
      // axios requires `es6-promise` polyfill so we replace it with bluebird
      //'es6-promise': 'bluebird'
    //},
    extensions: ['', '.js']
  },
  bail: prod,
  //watch: 'true',
  target: 'node',
  node: {
    console: true,
    process: true,
    global: true,
    buffer: true,
    __filename: true,
    __dirname: true
  },
  module: {
    loaders: [
      {
        //test: /src\/.+\.js?$/,
        test: /\.js$/,
        exclude: /node_modules/,
        loaders:
            //prod
            // the optional 'runtime' transformer tells babel to require
            // the runtime instead of inlining it.
            //?
            //[             'babel-loader?stage=0&optional=runtime']
            //:
            ['monkey-hot', 'babel?stage=0&optional=runtime']
      }
    ]
  },
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'vendor',
    //  minChunks: 2
    //}),
    //new webpack.DefinePlugin({
    //  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
    //}),
    //new webpack.optimize.DedupePlugin(),
    //new ExtractTextPlugin('[name].[contenthash].css', {
    //  allChunks: true
    //}),
    //new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    //new webpack.NoErrorsPlugin(),
    //new StatsPlugin(),

    //new webpack.NormalModuleReplacementPlugin(/\.styl/, 'node-noop'),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  recordsPath: path.join(__dirname, '_records.server.json')
};

if (prod) {

  config.devtool = 'sourcemap';
  //config.output.devtoolModuleFilenameTemplate = "file://[resource-path]";
  //config.output.devtoolFallbackModuleFilenameTemplate = "file://[resource-path]?[hash]";
  //
  //config.plugins.push(
  //  new webpack.optimize.UglifyJsPlugin({comments: /a^/, compress: {warnings: false}})
  //);

} else {
  //config.devtool = 'eval';
  config.devtool = 'source-map';
  //config.debug = true;

  for (var key in config.entry) {
    if (key !== 'vendor') {
      config.entry[key].unshift(
        //'webpack-dev-server/client?http://127.0.0.1:3001',
        //'webpack/hot/only-dev-server'
        'webpack/hot/signal.js'
      );
    }
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin({ quiet: true }));
}

module.exports = config;
