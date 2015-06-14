# rjanko 

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies Status][david-image]][david-url]

[npm-image]: http://img.shields.io/npm/v/rjanko.svg
[npm-url]: https://npmjs.org/package/rjanko

[travis-image]: https://travis-ci.org/kompot/rjanko.svg?branch=master
[travis-url]: https://travis-ci.org/kompot/rjanko

[coveralls-image]: https://coveralls.io/repos/kompot/rjanko/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/kompot/rjanko?branch=master

[david-image]: https://david-dm.org/kompot/rjanko.svg
[david-url]: https://david-dm.org/kompot/rjanko 

In **heavy** development until version 0.1.0. Not nearly usable until then.

## Rationale

There are lots of fine libs for JavaScript/NodeJS out there. Not so much as for frameworks. With React/Webpack/Babel coming to mainstream it's becoming obvious that there's no decent full stack framework embracing those technologies. So *the* goal of this project is to become Ruby on Rails/Django for modern JS stack. Not nearly ready even for alpha quality prototypes. Wait for 0.1.0.

There are some libs that should be considered base platfrom for Rjanko and chance of them going away is extremly low:

- [React](http://facebook.github.io/react/)
- [Webpack](http://webpack.github.io/)
- [Babel](https://babeljs.io/)
- [Bluebird](https://github.com/petkaantonov/bluebird/)
- [Lodash](https://lodash.com/)
- [Express](http://expressjs.com/)

All others should/must be made optional or replacable.

## Goals

There 2 main goals of this project:

- make full stack JS developer as productive as possible 
- use as little self written code as possible, rely on well established 
libraries, avoid [bikeshedding](https://en.wikipedia.org/wiki/Parkinson's_law_of_triviality)
at all times
- make libs other than core (see above) pluggable

## Wanna try?

Quick start on a Mac OS X

```                                       
# install nvm to manage node/npm versions and MongoDB
brew install nvm mongodb

# make dir for sample project
mkdir myproject
cd myproject

# install latest iojs
nvm install 2.3.0
nvm default 2.3.0

# install Yeoman and its generator for Rjanko
# or use '-g' key to skip './node_modules/.bin/' prefix below
npm install yo generator-rjanko

# run Yeoman generator to scaffold a project
./node_modules/.bin/yo rjanko

# click next couple of times
# Use node foreman to run sample project
./node_modules/.bin/nf start
```

Head to http://localhost:5000/ to see some models that can be created/updated.
