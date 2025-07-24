const { Expense } = require("../models");

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { UserId: req.user.id }
    });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Failed to fetch expenses", error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newExpense = await Expense.create({
      amount,
      description,
      category,
      UserId: req.user.id
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).json({ message: "Failed to add expense", error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const expenseId = req.params.id;

    const [updated] = await Expense.update(
      { amount, description, category },
      { where: { id: expenseId, UserId: req.user.id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    const updatedExpense = await Expense.findByPk(expenseId);
    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Failed to update expense", error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.destroy({
      where: { id: req.params.id, UserId: req.user.id }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Failed to delete expense", error: err.message });
  }
};
