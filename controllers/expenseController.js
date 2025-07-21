const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id;

  try {
    const expense = await Expense.create({ amount, description, category, UserId: userId });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Failed to add expense", error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const result = await Expense.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    if (result === 0) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete expense" });
  }
};
