import React from 'react';
import _ from 'lodash';
import History from 'flux-router-component/lib/History';
import queryString from 'query-string';
import Baobab from 'baobab';
import {root} from 'baobab-react/higher-order';

import Layout from './components/Layout';
import routes, {actions} from './routes';

require('react-widgets/lib/less/react-widgets.less');

const history = new History();

const debug = require('./logging/debug')(__filename);
const derror = require('./logging/debug')(__filename, 'error');

const data = new Baobab(window._app_state_, {
  syncwrite: true
});

function setRouteTo(route) {
  const newRoute = {
    name: route.name,
    params: route.params,
    query: route.query
  };
  if (_.isEqual(newRoute, data.select('route').get())) {
    return;
  }
  data.set('route', newRoute);
}

routes.navigateTo = function navigateTo(url, fromHistory = false) {
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
        .catch(function catchActionError(error) {
          // TODO shouldn't there be a separate page
          // for each meaningful HTTP error code
          if (error.status === 401) {
            debug(`Access denied. Redirecting to login.`);
            route = routes.getRoute('/401');
            setRouteTo(route);
          } else {
            derror(`route ${route.name} failed, redirecting to 500`);
            derror(error);
            route = routes.getRoute('/500');
            setRouteTo(route);
          }
        });
  }
};

history.on(() => routes.navigateTo(history.getUrl(), true));

const BaobabInjectedLayout = root(Layout, data);
React.render(<BaobabInjectedLayout />, document.getElementById('app'));
