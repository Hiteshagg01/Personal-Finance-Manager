import express from "express";
const router = express.Router();

import { Investment } from "../models/index.js";

router
  .route("/")
  .get(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const investments = await Investment.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      return res.json({ count: investments.length, data: investments });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to get investment : ${error.message}`,
      });
    }
  })
  .post(async (req, res) => {
    if (!req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { asset_type, amount, purchase_date } = req.body;

    if (!asset_type || !amount || !purchase_date) {
      return res.status(400).json({
        message: "Send all required fields (asset type, amount, purchase date)",
      });
    }

    // more checks category must be a valid category, amount must be decimal number, dates must be a valid date string

    try {
      const newInvestment = await Investment.create(
        {
          user_id: req.user.id,
          asset_type,
          amount,
          purchase_date,
          current_value: req.body.current_value || null,
          description: req.body.description || null,
        },
        {
          returning: true,
        }
      );

      res
        .status(201)
        .json({ message: "Investment Saved", data: newInvestment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: `Failed to save investment : ${error.message}`,
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
      const foundInvestment = await Investment.findOne({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!foundInvestment) {
        return res
          .status(404)
          .json({ message: `Investment with id : ${id} not found` });
      }

      res.json(foundInvestment);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to get investment: ${error.message}`,
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

    const { asset_type, amount, purchase_date } = req.body;

    if (!asset_type || !amount || !purchase_date) {
      return res.status(400).json({
        message: "Send all required fields (asset type, amount, purchase date)",
      });
    }
    
    try {
      const [affectedRows, updatedInvestment] = await Investment.update(
        {
          user_id: req.user.id,
          asset_type,
          amount,
          purchase_date,
          current_value: req.body.current_value || null,
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
          .json({ message: `Investment with id : ${id} not found` });
      }

      res.json({
        message: `${affectedRows} investment(s) updated`,
        data: updatedInvestment[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Failed to update investment : ${error.message}`,
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
      const result = await Investment.destroy({
        where: {
          user_id: req.user.id,
          id,
        },
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: `Investment with id : ${id} not found` });
      }

      return res.json({ message: "Investment deleted successfully" });
    } catch (error) {
      console.error(error);
      return res
        .json(500)
        .json({ message: `Failed to delete investment : ${error.message}` });
    }
  });

router.route("/filter").get(async (req, res) => {});

export default router;
