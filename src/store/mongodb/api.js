import _ from 'lodash';
import mongoose from 'mongoose';
import Promise from 'bluebird';
Promise.promisifyAll(mongoose);
import express from 'express';

const debug = require('../../core/logging/debug')(__filename);

require('./connection.js');

const expressApp = express();

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
  expressApp.get(`/${key.toLowerCase()}`, async (req, res, next) => {
    const findQuery = {};
    if (req.query.search) {
      findQuery.name = new RegExp(req.query.search, 'i');
    }
    // TODO remove groups
    res.send(await models[key].find(findQuery).populate('groups').lean().execAsync());
  });
  expressApp.get(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    // TODO remove groups
    res.send(await models[key].find({'_id': req.params.id}).populate('groups').lean().execAsync());
  });
  expressApp.put(`/${key.toLowerCase()}`, async (req, res, next) => {
    res.send(await models[key].createAsync(req.body));
  });
  expressApp.post(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    res.send(await models[key].findByIdAndUpdateAsync(req.params.id, req.body));
  });
  expressApp.delete(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    res.send(await models[key].findByIdAndRemoveAsync(req.params.id));
  });
}

export default expressApp;
