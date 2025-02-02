import express from "express";
const router = express.Router();

import { Expense } from "../models/index.js";

router.get("/filter", async (req, res) => {
  if (!req.user.id) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const { category } = req.query;

  if (!category) {
    return res
      .status(400)
      .json({ message: "Invalid query, filter by category" });
  }

  try {
    const filteredExpenses = await Expense.findAll({
      where: {
        user_id: req.user.id,
        category,
      },
    });

    return res.json({ count: filteredExpenses.length, data: filteredExpenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Failed to filter expenses : ${error.message}`,
    });
  }
});

router
  .route("/")
  .get(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const expenses = await Expense.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      return res.json({ count: expenses.length, data: expenses });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to get budget : ${error.message}`,
      });
    }
  })
  .post(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({
        message: "Send all required fields (category, amount, date)",
      });
    }

    // more checks category must be a valid category, amount must be decimal number, dates must be a valid date string

    try {
      const newExpense = await Expense.create(
        {
          user_id: req.user.id,
          category,
          amount,
          date,
          description: req.body.description || null,
        },
        {
          returning: true,
        }
      );

      res.status(201).json({ message: "Expense Saved", data: newExpense });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: `Failed to save expense : ${error.message}`,
      });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: `Sent id : ${id} is invalid.` });
    }

    try {
      const foundExpense = await Expense.findOne({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!foundExpense) {
        return res
          .status(404)
          .json({ message: `Expense with id : ${id} not found` });
      }

      res.json(foundExpense);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to get expense: ${error.message}`,
      });
    }
  })
  .put(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: `Sent id : ${id} is invalid.` });
    }

    const { category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({
        message: "Send all required fields (category, amount, date)",
      });
    }

    try {
      const [affectedRows, updatedExpense] = await Expense.update(
        {
          user_id: req.user.id,
          category,
          amount,
          date,
          description: req.body.description || null,
        },
        {
          returning: true,
          where: {
            user_id: req.user.id,
            id,
          },
        }
      );

      if (!affectedRows) {
        return res
          .status(404)
          .json({ message: `Expense with id : ${id} not found` });
      }

      res.json({
        message: `${affectedRows} expense(s) updated`,
        data: updatedExpense[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to update expense : ${error.message}`,
      });
    }
  })
  .delete(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: `Sent id : ${id} is invalid.` });
    }

    try {
      const result = await Expense.destroy({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: `Expense with id : ${id} not found` });
      }

      return res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error(error);
      return res
        .json(500)
        .json({ message: `Failed to delete expense : ${error.message}` });
    }
  });

export default router;
