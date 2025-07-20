const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('expense_db', 'root', 'Shashank@12', {
  host: 'localhost',
  dialect: 'mysql'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);

module.exports = db;
