import axios from 'axios';
import socketIO from 'socket.io-client';
import Promise from 'bluebird';

import settings from 'core/settings';

const debug = require('core/logging/debug')(__filename);

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
      debug(`socket ${method} ${url}`);
      let requestId = this.requestCounter++;
      let responsePromise = new Promise((resolve, reject) => {
        this.resolvers[requestId] = function resolveApi(response) {
          debug(`${url} resolve`, response.data);
          resolve(response);
        };
        this.rejectors[requestId] = function rejectApi(response) {
          debug(`${url} reject`, response);
          reject(response);
        };
      }).cancellable().timeout(maxSocketTimeout);
      this.socketConn.emit('apiRequest', {requestId, method, url, data, cookies: document.cookie});
      return responsePromise;
    }
    debug(`http ${method} ${url}`);
    return axios[method](`${settings.apiHost()}${url}`, data);
  }

  post(url, payload = {}) {
    return this._request('post', url, payload);
  }

  get(url, payload = {}) {
    return this._request('get', url, payload);
  }

  news() {
    return this.get(`/api/news?offset=0&limit=20`);
  }

  login({username, password}) {
    return this.post('/api/login', {username, password});
  }

  logout() {
    return this.post('/api/signout');
  }

  groups({search}) {
    return this.get(`/api/groups?search=${search}`);
  }

}

export default new Api();
