const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('expense_db', 'root', 'Shashank@12', {
  host: 'localhost',
  dialect: 'mysql'
});


module.exports = sequelize;