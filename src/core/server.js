import http from 'http';
import path from 'path';

import axios from 'axios';
import express from 'express';
import SocketIoServer from './SocketIoServer';

require('source-map-support').install();

const debug = require('./logging/debug')(__filename);
const expressApp = express();
//const statsJsonPath = path.join(process.cwd(), 'build', '_stats.json');

import renderApp from './renderApp';

const readWebpackBuildStats = (req) => {
  // TODO do not read on every request in prod mode!
  if (process.env.NODE_ENV === 'production') {
    return axios.get(req.protocol + '://' + req.get('host') + '/build/_stats.json');
  }
  return axios.get('http://127.0.0.1:3001/build/_stats.json');
};

if (process.env.NODE_ENV === 'production') {
  expressApp.use('/build', express.static(path.join(process.cwd(), 'build')));
}

//expressApp.get('/_webpack_stats.json', function(req, res, next) {
//  const webpackAssets = readWebpackBuildStats();
//  res.send(webpackAssets);
//});

import {authApp, addAuthToExpressApp} from './auth.js';

addAuthToExpressApp(expressApp);
// TODO everything collapses in single namespace!
expressApp.use('/api', authApp);
expressApp.use('/api', require('../store/mongodb/api.js'));

expressApp.use(async (req, res, next) => {
  const webpackAssets = await readWebpackBuildStats(req);
  renderApp(req, res, next, webpackAssets.data).catch(next);
});

expressApp.use((err, req, res, next) => {
  if (err) {
    debug(err.stack);
    res.send('<html><body><pre>' + err.stack + '</pre></body></html>');
  }
  next();
});

export default expressApp;
