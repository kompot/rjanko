import fs from 'fs'
import http from 'http';
import path from 'path';

import axios from 'axios';
import Promise from 'bluebird';
import React from 'react';

import Structure from './Structure';
import initData from './data';
import Html from './components/Html';
import Layout from './components/Layout';
import routes, {actions} from './routes';
import marshall from './marshall';
import settings from './settings';

const debug = require('debug')('rjanko:renderApp');

function renderHtml(res, data, webpackAssets) {
  const cursor = data.cursor();
  const markup = React.renderToString(<Layout data={cursor} />);
  const html = React.renderToStaticMarkup(<Html webpackAssets={webpackAssets} markup={markup} state={marshall.stringify(cursor.deref())} />);
  res.send(`<!doctype html>\n${html}`);
}

export default async function(req, res, next, webpackAssets) {
  let route = routes.getRoute(req.path);

  //let manifestRequestHeaders = {};
  //if (req.headers.cookie) {
  //  manifestRequestHeaders.Cookie = req.headers.cookie;
  //}
  //let manifestResponse = await axios({
  //  url: `${settings.apiHost()}/api/manifest/`,
  //  headers: manifestRequestHeaders
  //});

  const data = new Structure(initData, false);

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
