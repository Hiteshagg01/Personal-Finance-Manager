import "dotenv/config";
import express from "express";
const app = express();
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";

import sequelize from "./config/sequelize.js";

import { authRoutes, budgetRoutes } from "./routes/index.js";
import passport from "passport";

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(['k', 'mySecret']));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Using routers
app.use("/auth", authRoutes);
app.use("/budget", budgetRoutes);

app
  .listen(3000, () => {
    console.log(` ✅ server online on http://localhost:3000`);
  })
  .on("error", (err) => {
    console.error(` ❌ failed to connect to server:${err}`);
  });

// Server Tables sync
// sequelize
//   .sync()
//   .then(() => {
//     console.log(` 👍 Data synced`);
//   })
//   .catch((err) => {
//     console.error(` 👎 Error syncing database : ${err}`);
//   });
