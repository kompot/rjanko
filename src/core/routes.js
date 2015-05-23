import Routr from 'routr';
import _ from 'lodash';

const routes = {

  home: {
    path: '/'
  },

  admin: {
    path: '/admin'
  },

  404: {
    path: '/404'
  },

  500: {
    path: '/500'
  }

};

const _actions = {};

_.forOwn(routes, (route) => {
  routes[route].method = 'get';
  if (routes[route].action) {
    _actions[route] = routes[route].action;
  }
});

export const actions = _actions;

export default new Routr(routes);
