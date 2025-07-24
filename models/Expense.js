// models/Expense.js
module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define("Expense", {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Expense;
};
