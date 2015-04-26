import api from './api';
import Promise from 'bluebird';
import Routr from 'routr';

const debug = require('debug')('rjanko:routes');

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

for (let route in routes) {
  routes[route].method = 'get';
  if (routes[route].action) {
    _actions[route] = routes[route].action;
  }
}

export const actions = _actions;

export default new Routr(routes);
