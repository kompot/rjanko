import _ from 'lodash';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express from 'express';
import expressSession from 'express-session';

const debug = require('./logging/debug')(__filename);

const authApp = express();
authApp.locals.title = 'Rjanko Auth Express Application';

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user))
});

passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user));
});

var MongoStore = require('connect-mongo')(expressSession);

function addAuthToExpressApp(eapp) {
  debug(`Add auth to express app`, eapp.locals.title);
  eapp.use(cookieParser());
  eapp.use(bodyParser.urlencoded({
      extended: true
    }));
  eapp.use(bodyParser.json());
  eapp.use(expressSession({
    // TODO replace with an ENV variable
    secret: 'sessionSuperVerySecret',
    store: new MongoStore({
      // TODO reuse Mongo connection
      url: require('cfg').db.mongo.connection,
      ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    resave: true,
    saveUninitialized: true,
    name: 'rjanko.sid',
    cookie: { path: '/', httpOnly: false }
  }));
  eapp.use(passport.initialize());
  eapp.use(passport.session());
}

//addAuthToExpressApp(authApp);

// TODO make user fetching pluggable, now it's too coupled with the storage
import mongoose from 'mongoose';
import Promise from 'bluebird';
Promise.promisifyAll(mongoose);
const User = require('../store/mongodb').User;

passport.use(new LocalStrategy(async (username, password, done) => {
  // TODO user fetching strategy must by injectable
  const u = await User.findOne({username, password}).populate('roles').lean().execAsync();
  if (u) {
    return done(null, {
      id: u._id,
      username: u.username,
      // TODO store role ids in session so it would take so much cookie space?
      activities: _.reduce(u.roles, (acc, r) => acc + r.activities, '')
    });
  }
  return done(null, false, {
    message: 'Incorrect username or password.'
  });
}));

authApp.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send(req.user);
});

export {authApp, addAuthToExpressApp};
