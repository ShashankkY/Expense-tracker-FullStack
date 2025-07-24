module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING"
    }
  });

  return Order;
};
