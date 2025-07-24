require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Disable SQL logging (good for production)
  }
);

// Import models
const UserModel = require('./Users');
const ExpenseModel = require('./Expense');
const OrderModel = require('./Order');

// Define models with sequelize instance
const Users = UserModel(sequelize, DataTypes);
const Expense = ExpenseModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);

// Setup Associations
Users.hasMany(Expense, { onDelete: 'CASCADE' });
Expense.belongsTo(Users);

Users.hasMany(Order, { onDelete: 'CASCADE' });
Order.belongsTo(Users);

// Sync DB (optional for first-time development only)
// sequelize.sync({ alter: true }); // Use with caution in prod

// Export
module.exports = {
  sequelize,
  Sequelize,
  Users,
  Expense,
  Order,
};
