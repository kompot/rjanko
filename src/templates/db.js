import Sequelize from 'sequelize';

export default new Sequelize('database', 'username', 'password', {

  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  storage: 'db.sqlite'

});
