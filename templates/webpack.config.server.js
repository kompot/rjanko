var os = require('os');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
//var StatsPlugin = require('rjanko/lib/statsPlugin');

var prod = process.env.NODE_ENV === 'production';
const configCommon = require('./webpack.config');

const nodeModules = {};

['node_modules', 'node_modules/rjanko/node_modules'].map(function (dir) {
  fs.readdirSync(dir)
    .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });
});

var config = {
  entry: {
    server: ['./src/server.js']
  },
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js'
  },
  externals: nodeModules,
  resolve: config.resolve,
  bail: prod,
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
    loaders: [{
        test: /\.js$/,
        include: /src/,
        loaders: ['babel']
      }, {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  recordsPath: path.join(__dirname, '_records.server.json')
};

config.devtool = 'source-map';
if (!prod) {
  config.debug = true;
}

module.exports = config;
