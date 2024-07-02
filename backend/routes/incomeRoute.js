import express from "express";
const router = express.Router();

import { Income } from "../models/index.js";


// future route
/* 
router.get("/filter", async (req, res) => {
  if (!req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});
*/

router
  .route("/")
  .get(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const incomes = await Income.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      return res.json({ count: incomes.length, data: incomes });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to get income : ${error.message}`,
      });
    }
  })
  .post(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { amount, date } = req.body;

    if (!amount || !date) {
      return res.status(400).json({
        message: "Send all required fields (amount, date)",
      });
    }

    // more checks category must be a valid category, amount must be decimal number, dates must be a valid date string

    try {
      const newIncome = await Income.create(
        {
          user_id: req.user.id,
          amount,
          source: req.body.source || null,
          description: req.body.description || null,
          date,
        },
        {
          returning: true,
        }
      );

      res.status(201).json({ message: "Income Saved", data: newIncome });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: `Failed to save income : ${error.message}`,
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
      const foundIncome = await Income.findOne({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!foundIncome) {
        return res
          .status(404)
          .json({ message: `Income with id : ${id} not found` });
      }

      res.json(foundIncome);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to get income: ${error.message}`,
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

    const { amount, date } = req.body;

    if (!amount || !date) {
      return res.status(400).json({
        message: "Send all required fields (amount, date)",
      });
    }

    try {
      const [affectedRows, updatedIncome] = await Income.update(
        {
          user_id: req.user.id,
          amount,
          source: req.body.source || null,
          description: req.body.description || null,
          date,
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
          .json({ message: `Income with id : ${id} not found` });
      }

      res.json({
        message: `${affectedRows} income(s) updated`,
        data: updatedIncome[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to update income : ${error.message}`,
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
      const result = await Income.destroy({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: `Income with id : ${id} not found` });
      }

      return res.json({ message: "Income deleted successfully" });
    } catch (error) {
      console.error(error);
      return res
        .json(500)
        .json({ message: `Failed to delete Income : ${error.message}` });
    }
  });

export default router;
