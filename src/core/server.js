import http from 'http';
import path from 'path';

import axios from 'axios';
import express from 'express';
import SocketIoServer from './SocketIoServer';

const debug = require('../core/logging/debug')(__filename);
const expressApp = express();
const statsJsonPath = path.join(process.cwd(), 'build', '_stats.json');

import renderApp from './renderApp';

const readWebpackBuildStats = (req) => {
  // TODO do not read on every request in prod mode!
  if (process.env.NODE_ENV === 'production') {
    return axios.get(req.protocol + '://' + req.get('host') + '/build/_stats.json');
  } else {
    return axios.get('http://127.0.0.1:3001/build/_stats.json');
  }
};

if (process.env.NODE_ENV === 'production') {
  expressApp.use('/build', express.static(path.join(process.cwd(), 'build')));
}

//expressApp.get('/_webpack_stats.json', function(req, res, next) {
//  const webpackAssets = readWebpackBuildStats();
//  res.send(webpackAssets);
//});

require('./auth')(expressApp);

expressApp.use(async (req, res, next) => {
  const webpackAssets = await readWebpackBuildStats(req);
  renderApp(req, res, next, webpackAssets.data).catch(next);
});

expressApp.use((err, req, res, next) => {
  if (err) {
    debug(err.stack);
    res.send('<html><body><pre>' + err.stack + '</pre></body></html>');
  }
});

const port = process.env.PORT || 3000;
const server = http.Server(expressApp);

new SocketIoServer(server);

server.listen(port, (err, result) => {
  if (err) {
    debug(err);
  }
  debug(`Express server listening on ${port}`);
});
