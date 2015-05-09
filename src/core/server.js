import fs from 'fs'
import http from 'http';
import path from 'path';

import axios from 'axios';
//import db from './db';
import express from 'express';
//import Sequelize from 'sequelize';
import Promise from 'bluebird';
import React from 'react';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import Structure from './Structure';
import defaultData from './data';
import Html from './components/Html';
import Layout from './components/Layout';
import routes, {actions} from './routes';
import marshall from './marshall';
import settings from './settings';

const app = express();
const statsJsonPath = path.join(path.dirname(process.argv[1]), '..', 'build', '_stats.json');
const debug = require('debug')('rjanko:server');

function renderHtml(res, data, webpackAssets) {
  const cursor = data.cursor();
  const markup = React.renderToString(<Layout data={cursor} />);
  const html = React.renderToStaticMarkup(<Html webpackAssets={webpackAssets} markup={markup} state={marshall.stringify(cursor.deref())} />);
  res.send(`<!doctype html>\n${html}`);
}

async function renderApp(req, res, next, webpackAssets) {
  let route = routes.getRoute(req.path);

  //let manifestRequestHeaders = {};
  //if (req.headers.cookie) {
  //  manifestRequestHeaders.Cookie = req.headers.cookie;
  //}
  //let manifestResponse = await axios({
  //  url: `${settings.apiHost()}/api/manifest/`,
  //  headers: manifestRequestHeaders
  //});

  const data = new Structure(defaultData, false);

  //data.setIn('user', manifestResponse.data.user);

  if (!route) {
    route = routes.getRoute('/404');
  }

  data.setIn('route', {
    name: route.name,
    params: route.params,
    query: req.query
  });

  const actionPromise = actions[route.name]
      ? actions[route.name](data, route.params, req.query)
      : new Promise(resolve => resolve());

  actionPromise.then(function() {
    renderHtml(res, data, webpackAssets);
  }).catch((e) => {
    //throw e;
    route = routes.getRoute('/500');
    data.setIn('route', {name: route.name, params: route.params});
    renderHtml(res, data, webpackAssets);
    next();
  });
}

if (process.env.NODE_ENV === 'production') {

  const webpackAssets = JSON.parse(fs.readFileSync(statsJsonPath));

  app.get('/_webpack_stats.json', function (req, res, next) {
    res.send(webpackAssets)
  });

  app.use('/build', express.static(path.join(__dirname, 'build')));

  app.use(function(req, res, next) {
    renderApp(req, res, next, webpackAssets).catch(next)
  });

  app.use(function(err, req, res, next) {
    if (err) {
      debug(err.stack);
      res.send('internal error ;(');
    }
  });

} else {

  var webpackServer = new WebpackDevServer(webpack(require(
      path.join(path.dirname(process.argv[1]), '../webpack.config')
  )), {
    publicPath: 'http://0.0.0.0:3001/build/',
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

  webpackServer.listen(3001, '0.0.0.0', function (err, result) {
    if (err) {
      debug(err);
    } else {
      debug('webpack server listening on 3001');
    }
  });

  //app.use(favicon(path.join(__dirname, 'favicon.ico')));

  app.get('/_webpack_stats.json', function(req, res, next) {
    const webpackAssets = JSON.parse(webpackServer.middleware.fileSystem.readFileSync(statsJsonPath));
    res.send(webpackAssets);
  });

  app.use(function(req, res, next) {
    const webpackAssets = JSON.parse(webpackServer.middleware.fileSystem.readFileSync(statsJsonPath));
    renderApp(req, res, next, webpackAssets).catch(next);
  });

  app.use(function(err, req, res, next) {
    if (err) {
      debug(err.stack);
      res.send('<html><body><pre>' + err.stack + '</pre></body></html>');
    }
  });

}

const port = process.env.PORT || 3000;
const server = http.Server(app);

async function makeApiRequest(socket, payload) {
  const {status, data, headers} = await axios({
    url: `${settings.apiHost()}${payload.url}`,
    method: payload.method,
    data: payload.data,
    responseType: 'text',
    headers: {
      'content-type': 'application/json',
      cookie: payload.cookies
    },
    transformResponse: [function(responseData) {
      try {
        return JSON.parse(responseData);
      } catch(e) {
        return undefined;
      }
    }]
  });
  socket.emit('apiResponse', {
    requestId: payload.requestId,
    status,
    data,
    cookies: headers['set-cookie']
  });
}

var io = require('socket.io')(server);
io.on('connection', function(socket){
  socket.on('apiRequest', payload => makeApiRequest(socket, payload));
});

server.listen(port, function(err, result) {
  if (err) {
    debug(err);
  }
  debug(`express listening on ${port}`);
});




//app.get('/admin', (req, res) => {
//  res.send('Welcome to admin of <%= rjanko.name %>')
//});
//
//app.get('/', (req, res) => {
//  res.send(`Hello World, <%= rjanko.name %>!`);
//});

//app.post('/users', (req, res) => {
//
//  var User = db.define('user', {
//    firstName: {
//      type: Sequelize.STRING,
//      field: 'first_name'
//    },
//    lastName: {
//      type: Sequelize.STRING
//    }
//  }, {
//    freezeTableName: true
//  });
//
//
//  User.sync({force: true}).then(function () {
//    // Table created
//    return User.create({
//      firstName: 'Антон',
//      lastName: 'Федченко'
//    });
//  });
//
//  res.send(`Post users`);
//});
//
//app.get('/users', (req, res) => {
//  res.send(`Get users`);
//});

//const server = app.listen(3000, () => {
//
//  const host = server.address().address;
//  const port = server.address().port;
//
//  console.log('Example app listening at http://%s:%s', host, port);
//
//});
