import express from "express";
const router = express.Router();

import { Expense } from "../models/index.js";

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: {
        // user id
      },
    });

    res.json({ count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

router.post("/", async (req, res) => {
  const { amount, category, date } = req.body;

  if (!amount || !category || !date) {
    return res
      .status(400)
      .json({ message: `Send all required fields : (amount, category, date)` });
  }

  try {
    const newExpense = await Expense.create({
        // user_id
        amount,
        category,
        description : req.body.description,
        date
    })

    res.status(201).json(newExpense)
  } catch (error) {
    return res.status(500).json({message : error.message || "Something went wrong"})
  }
});

export default router;
