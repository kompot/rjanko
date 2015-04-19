const express = require('express');
const app = express();


import Sequelize from 'sequelize';

import db from './db';



app.get('/', (req, res) => {
  res.send(`Hello World, <%= rjanko.name %>!`);
});

app.post('/users', (req, res) => {

  var User = db.define('user', {
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name'
    },
    lastName: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true
  });


  User.sync({force: true}).then(function () {
    // Table created
    return User.create({
      firstName: 'Антон',
      lastName: 'Федченко'
    });
  });

  res.send(`Post users`);
});

app.get('/users', (req, res) => {
  res.send(`Get users`);
});

const server = app.listen(3000, () => {

  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
