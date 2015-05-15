import path from 'path';
import http from 'http';
import express from 'express';

let app = express();

let server = http.createServer(app);

function xx() {
  return '11y';
}

app.get('/xxx1', function (req, res, next) {
  res.send(xx())
});

function __eval() {
  console.log('_____ __eval');
}

export default server;
