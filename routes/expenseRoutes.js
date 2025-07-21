const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authenticate = require("../middleware/authenticate");

router.use(authenticate);

router.post("/", expenseController.addExpense);
router.get("/", expenseController.getExpenses);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
