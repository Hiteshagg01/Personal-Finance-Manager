import express from "express";
const router = express.Router();

import { Budget } from "../models/index.js";

router.get("/", async (req, res) => {
  //   Check if the client is admin

  try {
    const budgets = await Budget.findAll({
      where: {
        // user_id: req.user for the current user
      },
    });

    res.json({ count: budgets.length, data: budgets });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
});

router.get("/filter", async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res
      .status(400)
      .json({ message: "please select a category to filter" });
  }

  try {
    const result = await Budget.findAll({
      where: {
        category,
        // user_id: 1, check for specific user
      },
    });
    res.json({ count: result.length, data: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
});

router.post("/", async (req, res) => {
  const { category, amount, start_date, end_date } = req.body;

  if (!category || !amount || !start_date || !end_date) {
    res.status(400).json({
      message:
        "Send all required fields (category, amount, start date, end date)",
    });
  }

  try {
    const newBudget = await Budget.create({
      user_id: "Current user id",
      category,
      amount,
      start_date,
      end_date,
    });

    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

export default router;
