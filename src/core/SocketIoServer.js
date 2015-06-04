import settings from './settings';
import axios from 'axios';
const derror = require('core/logging/debug')(__filename, 'error');

export default class SocketIoServer {

  constructor(server) {
    this.io = require('socket.io')(server);
    this.io.on('connection', (socket) => {
      socket.on('apiRequest', (payload) => this.makeApiRequest(socket, payload));
    });
  }

  async makeApiRequest(socket, payload) {
    try {
      const {status, data, headers} = await axios({
        url: `${settings.apiHost()}${payload.url}`,
        method: payload.method,
        data: payload.data,
        responseType: 'text',
        headers: {
          'content-type': 'application/json',
          cookie: payload.cookies
        },
        transformResponse: [(responseData) => {
          try {
            return JSON.parse(responseData);
          } catch(e) {
            return undefined;
          }
        }]
      });
      socket.emit('apiResponse', {
        requestId: payload.requestId,
        status,
        data,
        cookies: headers['set-cookie']
      });
    } catch (e) {
      derror(`Unable to perform request`, e);
    }
  }

}
