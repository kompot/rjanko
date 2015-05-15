import fs from 'fs'
import http from 'http';
import path from 'path';

import axios from 'axios';
import express from 'express';
import Promise from 'bluebird';
import React from 'react';

const expressApp = express();
const statsJsonPath = path.join(path.dirname(process.argv[1]), 'build', '_stats.json');
const debug = require('debug')('rjanko:server');






const webpackAssets = JSON.parse(fs.readFileSync(statsJsonPath));

expressApp.get('/_webpack_stats.json', function (req, res, next) {
  res.send(webpackAssets)
});

expressApp.use('/build', express.static(path.join(__dirname, 'build')));

expressApp.use(function(req, res, next) {
  renderApp(req, res, next, webpackAssets).catch(next)
});

expressApp.use(function(err, req, res, next) {
  if (err) {
    debug(err.stack);
    res.send('Internal server error');
  }
});
