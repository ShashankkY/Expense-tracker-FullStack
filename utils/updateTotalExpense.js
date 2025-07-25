const { Expense, Users } = require("../models");

const updateUserTotalExpense = async (userId) => {
  const total = await Expense.sum('amount', {
    where: { UserId: userId }
  });

  await Users.update(
    { totalExpense: total || 0 },
    { where: { id: userId } }
  );
};

module.exports = updateUserTotalExpense;
