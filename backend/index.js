import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import sequelize from "./config/sequelize.js";
import {
  authRoutes,
  budgetRoutes,
  expenseRoutes,
  incomeRoutes,
  investmentRoutes,
} from "./routes/index.js";
import { checkAuth, checkUnAuth } from "./middleware/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Personal Finance Manager" });
});

app.use("/auth", checkUnAuth, authRoutes);
app.use("/budget", checkAuth, budgetRoutes);
app.use("/expense", checkAuth, expenseRoutes);
app.use("/income", checkAuth, incomeRoutes);
app.use("/investment", checkAuth, investmentRoutes);

app.delete("/logout", checkAuth, (req, res) => {
  req.logOut((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: err || "An error occurred during logout." });

    req.session.destroy((err) => {
      if (err)
        return res.status(500).send({
          message: err || "Failed to destroy the session during logout.",
        });
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully" });
    });
  });
});

app
  .listen(process.env.PORT)
  .on("listening", () => {
    console.log(` ✅ server listening on http://localhost:${process.env.PORT}`);
    // Data sync
    /*sequelize
      .sync({force: true})
      .then(() => {
        console.log(` 👍 Data synced`);
      })
      .catch((err) => {
        console.error(` 👎 Error syncing database : ${err}`);
      });*/
  })
  .on("error", () => {
    console.error(` ❌ failed to connect to server:${err}`);
  });
