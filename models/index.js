const sequelize = require('../config/db');
const User = require('./User');
const Expense = require('./Expense');

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = { sequelize, User, Expense };
