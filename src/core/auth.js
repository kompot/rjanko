import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express from 'express';
import expressSession from 'express-session';

const debug = require('./logging/debug')(__filename);

const authApp = express();

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user))
});

passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user));
});

var MongoStore = require('connect-mongo')(expressSession);

function addAuthToExpressApp(eapp) {
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

addAuthToExpressApp(authApp);

passport.use(new LocalStrategy((username, password, done) => {
  if (username === 'admin' && password === '12345') {
    return done(null, {id: 1, username: 'admin'});
  }
  return done(null, false, {
    message: 'Incorrect username or password.'
  });
}));

authApp.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send(req.user);
});

export {authApp, addAuthToExpressApp};
