require('dotenv').config(); // Load .env at the top

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Optional: remove Sequelize SQL logs
  }
);

module.exports = sequelize;
