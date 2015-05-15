import fs from 'fs'
import http from 'http';
import path from 'path';

import axios from 'axios';
import express from 'express';
import Promise from 'bluebird';
import React from 'react';
import SocketIoServer from './SocketIoServer';

const debug = require('debug')('rjanko:server.dev');
const expressApp = express();
const statsJsonPath = path.join(process.cwd(), 'build', '_stats.json');

import renderApp from './renderApp';

async function readWebpackBuildStats() {
  const {data} = await axios.get('http://127.0.0.1:3001/build/_stats.json');
  return data;
}

expressApp.get('/_webpack_stats.json', function(req, res, next) {
  const webpackAssets = readWebpackBuildStats();
  res.send(webpackAssets);
});

expressApp.use(function(req, res, next) {
  const webpackAssets = readWebpackBuildStats();
  renderApp(req, res, next, webpackAssets).catch(next);
});

expressApp.use(function(err, req, res, next) {
  if (err) {
    debug(err.stack);
    res.send('<html><body><pre>' + err.stack + '</pre></body></html>');
  }
});






const port = process.env.PORT || 3000;
const server = http.Server(expressApp);

new SocketIoServer(server);

server.listen(port, function(err, result) {
  if (err) {
    debug(err);
  }
  debug(`Express server listening on ${port}`);
});
