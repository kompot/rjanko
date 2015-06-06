import React from 'react';
import Routr from 'routr';
import _ from 'lodash';

const debug = require('core/logging/debug')(__filename);
import {Component} from 'core/components/Component';
import Api from 'core/api.js';

const routes = {

  home: {
    path: '/'
  },

  admin: {
    path: '/admin'
  },

  adminLogin: {
    path: '/admin/login'
  },

  404: {
    path: '/404'
  },

  500: {
    path: '/500'
  }

};

const models = require('../models/viewable');

models.map((model) => {
  routes[`admin${model}List`] = {
    path: `/a/${model}`,
    action: async (data, params, query) => {
      const listData = await Api.get(`/api/${model.toLowerCase()}`);
      data.set(['admin', 'list', model], listData.data);
    }
  };
  routes[`admin${model}Details`] = {
    path: `/a/${model}/details/:id`,
    action: async (data, params, query) => {
      const users = await Api.get(`/api/${model.toLowerCase()}/${params.id}`);
      data.set(['admin', 'details', model, params.id], users.data);
    }
  };
});

const _actions = {};

_.forOwn(routes, (route, key) => {
  route.method = 'get';
  if (route.action) {
    _actions[key] = route.action;
  }
});

export const actions = _actions;

export default new Routr(routes);
