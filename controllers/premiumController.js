// controllers/premiumController.js
const { Users, Expense } = require('../models');
const { Sequelize } = require('sequelize'); // Required for aggregation functions

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Users.findAll({
      attributes: [
        'id',
        'name',
        'email',
        [Sequelize.fn('SUM', Sequelize.col('Expenses.amount')), 'totalExpense']
      ],
      include: [{
        model: Expense,
        attributes: []
      }],
      group: ['Users.id'],
      order: [[Sequelize.literal('totalExpense'), 'DESC']]
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Could not fetch leaderboard", error: error.message });
  }
};
