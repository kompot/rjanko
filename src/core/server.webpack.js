var path = require('path');
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');

var port = 3001;
var compiler = webpack(require(path.join(
  process.cwd(),
  'webpack.config.client.js'
)));

var webpackServer = new WebpackDevServer(compiler, {
  publicPath: 'http://0.0.0.0:' + port + '/build/',
  watchDelay: 0,
  hot: true,
  stats: {
    colors: true,
    assets: true,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: false
  }
});

webpackServer.listen(port, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err, result);
  } else {
    console.log('Webpack dev server listening on ' + port);
  }
});
