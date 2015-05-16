import React from 'react';
import Promise from 'bluebird';
import Immutable from 'immutable';
import History from 'flux-router-component/lib/History';
import queryString from 'query-string';

import Layout from './components/Layout';
import routes, {actions} from './routes';
import marshall from './marshall';
import Structure from './Structure';

const history = new History();

const debug = require('debug')('rjanko:client');

const data = new Structure(marshall.parse(window._app_state_), true);

function setRouteTo(route) {
  const newRoute = Immutable.fromJS({
    name: route.name,
    params: route.params,
    query: route.query
  });
  if (Immutable.is(newRoute, data.cursor('route').deref())) {
    return;
  }
  data.cursor('route').set(newRoute);
}

routes.navigateTo = function(url, fromHistory=false) {
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
  React.render(<Layout data={data.cursor()} />, container);
}

const fontPromises = [
  new FontFaceObserver('Roboto', {weight: 400}).check(null, 2000)
];

debug('waiting for fonts to load');

Promise.all(fontPromises).then(function() {
  debug('fonts loaded');
  render();
  data.on('change', render);
}).catch(function(e) {
  debug('failed to load fonts', e);
});
