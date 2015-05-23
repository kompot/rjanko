import React from 'react';
import Promise from 'bluebird';
import Immutable from 'immutable';
import History from 'flux-router-component/lib/History';
import queryString from 'query-string';
import Baobab from 'baobab';
import {root} from 'baobab-react/higher-order';

import Layout from './components/Layout';
import routes, {actions} from './routes';

const history = new History();

const debug = require('debug')('rjanko:client');

const data = new Baobab(window._app_state_, {
  syncwrite: true
});

function setRouteTo(route) {
  const newRoute = {
    name: route.name,
    params: route.params,
    query: route.query
  };
  var routeCursor = data.select('route');
  if (_.isEqual(newRoute, routeCursor.get())) {
    return;
  }
  data.set('route', newRoute);
}

routes.navigateTo = function(url, fromHistory = false) {
  if (!fromHistory) {
    history.pushState({}, 'no title', url);
  }
  window.scrollTo(0, 0);
  let route = routes.getRoute(url);
  if (!route) {
    route = routes.getRoute('/404');
  }
  route.query = url.indexOf('?') !== -1
      ? queryString.parse(url.substr(url.indexOf('?')))
      : {};
  setRouteTo(route);
  if (actions[route.name]) {
    actions[route.name](data, route.params, route.query)
        .catch(function(error) {
          console.error(`route ${route.name} failed, redirecting to 500`);
          console.log(error);
          route = routes.getRoute('/500');
          setRouteTo(route);
        });
  }
};

history.on(() => {
  routes.navigateTo(history.getUrl(), true);
});

const container = document.getElementById('app');

function render() {
  const BaobabInjectedLayout = root(Layout, data);
  React.render(<BaobabInjectedLayout />, container);
}
render();
