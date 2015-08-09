import _ from 'lodash';

import rjankoModels from '../../models';
let models = _.merge({}, rjankoModels);
require('cfg').applications.forEach(app => {
  Object.keys(app.models).forEach(m => models[m] = app.models[m]);
});

// TODO refactor out and use this enum everywhere
const ops = ['create', 'read', 'update', 'delete'];

module.exports = function (config) {

  config.routeHelpers(function (rh) {

    rh.getUser(function (req, cb) {
      cb(null, req.user);
    });

    rh.notAuthorized(function(req, res, next) {
      res.status(401).end();
    });

  });

  config.activities(function(activities){

    ops.map(op => {
      Object.keys(models).map(m => {
        activities.can(op + ' ' + m.toLowerCase(), (identity, params, cb) => {
          const result = identity.user && identity.user.activities.indexOf(op + ' ' + m.toLowerCase()) !== -1;
          cb(null, result);
        });
      });
    });

  });

};
