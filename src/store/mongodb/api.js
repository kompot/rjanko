import _ from 'lodash';
import mongoose from 'mongoose';
import Promise from 'bluebird';
Promise.promisifyAll(mongoose);
import express from 'express';

const debug = require('../../core/logging/debug')(__filename);

require('./connection.js');

const expressApp = express();
expressApp.locals.title = 'Rjanko MongoDB API Express Application';

var mustBe = require('mustbe');
var mustBeConfig = require('./mustbeConfig');
mustBe.configure(mustBeConfig);

const rjankoModels = require('./index');
let models = _.merge({}, rjankoModels);

Object.keys(models).map(addApiForModel);
require('cfg').applications.map(app =>
  Object.keys(app.modelsDb).forEach(addApiForModel)
);

require('cfg').applications.forEach(app =>
  Object.keys(app.modelsDb).forEach(m => {
    models[m] = app.modelsDb[m];
  })
)

function addApiForModel(key) {

  const keyL = key.toLowerCase();

  const readFn = async (req, res, next) => {
    const findQuery = {};
    if (req.query.search) {
      findQuery.name = new RegExp(req.query.search, 'i');
    }
    // TODO remove groups
    res.send(await models[key].find(findQuery).populate('groups').lean().execAsync());
  };

  const readOneFn = async (req, res, next) => {
    // TODO remove groups
    res.send(await models[key]
      .find({'_id': req.params.id})
      .populate('groups')
      .populate('roles')
      .lean().execAsync());
  };

  const createFn = async (req, res, next) => {
    res.send(await models[key].createAsync(req.body));
  };

  const updateFn = async (req, res, next) => {
    res.send(await models[key].findByIdAndUpdateAsync(req.params.id, req.body));
  };

  const deleteFn = async (req, res, next) => {
    res.send(await models[key].findByIdAndRemoveAsync(req.params.id));
  };

  expressApp.get(`/${keyL}`,        mustBe.routeHelpers().authorized(`read ${keyL}`,   readFn));
  expressApp.get(`/${keyL}/:id`,    mustBe.routeHelpers().authorized(`read ${keyL}`,   readOneFn));
  expressApp.put(`/${keyL}`,        mustBe.routeHelpers().authorized(`create ${keyL}`, createFn));
  expressApp.post(`/${keyL}/:id`,   mustBe.routeHelpers().authorized(`update ${keyL}`, updateFn));
  expressApp.delete(`/${keyL}/:id`, mustBe.routeHelpers().authorized(`delete ${keyL}`, deleteFn));

}

export default expressApp;
