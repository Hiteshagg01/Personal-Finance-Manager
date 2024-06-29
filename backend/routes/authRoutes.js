import express from "express";
const router = express.Router();

import passport from "../config/passport.js";

router.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ message: "please provide a username and password" });
  }

  passport.authenticate("local-login", (err, user) => {
    if (err) {
      return res.status(400).json({ message: err || "Something went wrong." });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: err || "Something went wrong." });
      }
    });

    return res.json(user);
  })(req, res);
});

router.post("/register", async (req, res) => {
  const { firstName, username, password, email } = req.body;
  if (!firstName || !username || !password || !email) {
    return res.status(400).json({
      message: "Send all fields to register",
    });
  }
  passport.authenticate("local-register", (err, user) => {
    if (err) {
      return res.status(400).json({ message: err || "Something went wrong." });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err || "Something went wrong" });
      }
    });

    return res.json(user);
  })(req, res);
});

router.delete("/logout", async (req, res) => {
  req.logOut((err) => {
    if (err) return res.status(500).json({ message: err });
    return res.status(200);
  });
});

export default router;
