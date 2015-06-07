# rjanko 

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies Status][david-image]][david-url]

In heavy development until version 0.1.0. Not nearly usable until then.

[npm-image]: http://img.shields.io/npm/v/rjanko.svg
[npm-url]: https://npmjs.org/package/rjanko

[travis-image]: https://travis-ci.org/kompot/rjanko.svg?branch=master
[travis-url]: https://travis-ci.org/kompot/rjanko

[coveralls-image]: https://coveralls.io/repos/kompot/rjanko/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/kompot/rjanko?branch=master

[david-image]: https://david-dm.org/kompot/rjanko.svg
[david-url]: https://david-dm.org/kompot/rjanko 

## Wanna try?

Quick start to fool around on Ubuntu 14.04.

I recommend using [Digital Ocean](https://www.digitalocean.com/?refcode=5cfd9196c66f) for quickest setup (if you choose smallest 512MB instance make sure to [setup swap](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04) so that `npm install` works and does not run out of RAM).

### Get mongo (for now MongoDB is the only storage option planned, PostgreSQL might come in 0.2.0+)

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Get nginx

```
apt-get install nginx
```

### Get & unpack sources

```
wget -O rjanko.zip http://github.com/kompot/rjanko/zipball/master
sudo apt-get install unzip unp
unp rjanko.zip
mv kompot-rjanko-* rjanko
```

### Install node/io/npm via nvm

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
source ~/.bashrc
cd rjanko
nvm install
```

### Install forego for devserver running
```
cd templates
wget -O forego https://godist.herokuapp.com/projects/ddollar/forego/releases/0.13.1/linux-amd64/forego
chmod +x forego
```

### Install node dependencies

```
npm install
./forego start -f Procfile.dev
```

If it starts up ok then `http://localhost:5000/a/User` should show a page with ability to add user/groups to MongoDB.
