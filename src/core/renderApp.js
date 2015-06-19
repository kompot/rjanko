import Promise from 'bluebird';
import React from 'react';
import Baobab from 'baobab';
import {root} from 'baobab-react/higher-order';

import initData from './data';
import Html from './components/Html';
import Layout from './components/Layout';
import routes, {actions} from './routes';

const debug = require('./logging/debug')(__filename);

function renderHtml(res, data, webpackAssets) {
  const BaobabInjectedLayout = root(Layout, data);
  const markup = React.renderToString(<BaobabInjectedLayout />);
  const html = React.renderToStaticMarkup(
      <Html webpackAssets={webpackAssets} markup={markup}
            state={data} />
  );
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

  const data = new Baobab(initData, {
    syncwrite: true
  });

  //data.setIn('user', manifestResponse.data.user);

  if (!route) {
    route = routes.getRoute('/404');
  }

  data.set('route', {
    name: route.name,
    params: route.params,
    query: req.query
  });

  data.set('env', {
    NODE_ENV: process.env.NODE_ENV
  });

  data.set('user', req.user);

  const actionPromise = actions[route.name]
      ? actions[route.name](data, route.params, req.query)
      : new Promise(resolve => resolve());

  actionPromise.then(() => renderHtml(res, data, webpackAssets)).catch((e) => {
    if (process.env.NODE_ENV === 'production') {
      route = routes.getRoute('/500');
      data.set('route', {
        name: route.name,
        params: route.params
      });
      renderHtml(res, data, webpackAssets);
      next();
    } else {
      throw e;
    }
  });
}

