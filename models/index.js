const sequelize = require('../config/db');
const Users = require('./Users');
const Expense = require('./Expense');

Users.hasMany(Expense,{ onDelete: 'CASCADE' });
Expense.belongsTo(Users);

module.exports = { sequelize, Users, Expense };
