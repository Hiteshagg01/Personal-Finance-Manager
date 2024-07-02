import express from "express";
const router = express.Router();

import passport from "../config/passport.js";

router.post("/login", (req, res) => {
  passport.authenticate("local-login", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .send({ message: err || "An error occurred during authentication." });
    }
    if (!user) {
      return res.status(401).send({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: err || "An error occurred during login." });
      }
      return res.json({ message: "Logged in successfully" });
    });
  })(req, res);
});

router.post("/register", async (req, res) => {
  passport.authenticate("local-register", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err || "Something went wrong." });
    }
    if (!user) {
      return res.status(401).send({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: err || "An error occurred during register" });
      }

      return res.json({ message: "Registered successfully" });
    });
  })(req, res);
});

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to the frontend
    res.redirect("http://localhost:5173");
  }
);

export default router;
