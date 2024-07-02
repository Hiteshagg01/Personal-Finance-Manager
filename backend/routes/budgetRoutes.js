import express from "express";
const router = express.Router();

import { Budget } from "../models/index.js";

router.get("/filter/", async (req, res) => {
  if (!req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { category } = req.query;

  if (!category) {
    return res
      .status(400)
      .json({ message: "Invalid query, filter by category" });
  }

  try {
    const filteredBudget = await Budget.findAll({
      where: {
        user_id: req.user.id,
        category,
      },
    });

    return res.json({ count: filteredBudget.length, data: filteredBudget });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Failed to filter budgets : ${error.message}`,
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
      const budgets = await Budget.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      return res.json({ count: budgets.length, data: budgets });
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

    const { category, amount, start_date, end_date } = req.body;

    if (!category || !amount || !start_date || !end_date) {
      return res.status(400).json({
        message:
          "Send all required fields (category, amount, start date, end date)",
      });
    }

    // more checks category must be a valid category, amount must be decimal number, dates must be a valid date string

    try {
      const newBudget = await Budget.create(
        {
          user_id: req.user.id,
          category,
          amount,
          start_date,
          end_date,
        },
        {
          returning: true,
        }
      );

      res.status(201).json({ message: "Budget Saved", data: newBudget });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: `Failed to save budget : ${error.message}`,
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
      const foundBudget = await Budget.findOne({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!foundBudget) {
        return res
          .status(404)
          .json({ message: `Budget with id : ${id} not found` });
      }

      res.json(foundBudget);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to get budget: ${error.message}`,
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

    const { category, amount, start_date, end_date } = req.body;

    if (!category || !amount || !start_date || !end_date) {
      return res.status(400).json({
        message:
          "Send all required fields (category, amount, start date, end date)",
      });
    }

    try {
      const [affectedRows, updatedBudget] = await Budget.update(
        {
          user_id: req.user.id,
          category,
          amount,
          start_date,
          end_date,
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
          .json({ message: `Budget with id : ${id} not found` });
      }

      res.json({
        message: `${affectedRows} budget(s) updated`,
        data: updatedBudget[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to update budgets : ${error.message}`,
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
      const result = await Budget.destroy({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: `Budget with id : ${id} not found` });
      }

      return res.json({ message: "Budget deleted successfully" });
    } catch (error) {
      console.error(error);
      return res
        .json(500)
        .json({ message: `Failed to delete budget : ${error.message}` });
    }
  });

export default router;
