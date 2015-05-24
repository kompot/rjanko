import axios from 'axios';
import socketIO from 'socket.io-client';
import Promise from 'bluebird';

import settings from './settings';

const debug = require('./logging/debug')(__filename);

const maxSocketTimeout = 8192;


class Api {

  constructor() {
    if (typeof window !== 'undefined') {
      this.socketConn = socketIO.connect();
      this.requestCounter = 0;

      this.resolvers = {};
      this.rejectors = {};

      this.socketConn.on('apiResponse', ({requestId, status, data, cookies}) => {
        if (cookies) {
          Api.setCookies(cookies);
        }
        if (status === 200 && this.resolvers[requestId]) {
          this.resolvers[requestId]({data, status});
        } else if (this.rejectors[requestId]) {
          this.rejectors[requestId]({data, status});
        }
        delete this.rejectors[requestId];
        delete this.resolvers[requestId];
      });
    }
  }

  static setCookies(cookies) {
    for (let cookie of cookies) {
      document.cookie = cookie;
    }
  }

  _request(method, url, data = {}) {
    if (this.socketConn) {
      debug(`socket.io ${method} ${url}`);
      let requestId = this.requestCounter++;
      let responsePromise = new Promise((resolve, reject) => {
        this.resolvers[requestId] = function(response) {
          debug(`${url} resolve`, response.data);
          resolve(response);
        };
        this.rejectors[requestId] = function(response) {
          debug(`${url} reject`, response);
          reject(response);
        };
      }).cancellable().timeout(maxSocketTimeout);
      this.socketConn.emit('apiRequest', {requestId, method, url, data, cookies: document.cookie});
      return responsePromise;
    } else {
      debug(`axios ${method} ${url}`);
      return axios[method](`${settings.apiHost()}${url}`, data);
    }
  }

  post(url, data = {}) {
    return this._request('post', url, data);
  }

  get(url, data = {}) {
    return this._request('get', url, data);
  }

  news() {
    return this.get(`/api/news?offset=0&limit=20`);
  }

  signin({username, password}) {
    return this.post('/api/signin', {username, password})
  }

  signout() {
    return this.post('/api/signout');
  }

}

export default new Api();
