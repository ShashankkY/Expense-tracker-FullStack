const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ✅ this is the actual Sequelize instance

const Users = sequelize.define('Users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Users;
