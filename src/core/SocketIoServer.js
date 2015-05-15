import settings from './settings';

export default class SocketIoServer {

  constructor(server) {
    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
      socket.on('apiRequest', payload => makeApiRequest(socket, payload));
    });
  }

  async makeApiRequest(socket, payload) {
    const {status, data, headers} = await axios({
      url: `${settings.apiHost()}${payload.url}`,
      method: payload.method,
      data: payload.data,
      responseType: 'text',
      headers: {
        'content-type': 'application/json',
        cookie: payload.cookies
      },
      transformResponse: [function(responseData) {
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
  }


}
