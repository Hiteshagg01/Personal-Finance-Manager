import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import bcrypt from "bcrypt";
import "dotenv/config";
import { Op } from "sequelize";

import { User } from "../models/index.js";

passport.use(
  "local-login",
  new LocalStrategy(async (username, password, cb) => {
    try {
      const foundUser = await User.findOne({
        where: {
          username: username,
        },
      });

      if (!foundUser) {
        cb(null, false, {
          message: "Username and password does not match. Try again.",
        });
      } else {
        bcrypt.compare(password, foundUser.dataValues.password, (err, same) => {
          if (err) {
            cb(err);
          } else if (same) {
            cb(null, {...foundUser.dataValues, password: null});
          } else {
            cb(null, false, {
              message: "Username and password does not match. Try again.",
            });
          }
        });
      }
    } catch (error) {
      cb(error);
    }
  })
);

passport.use(
  "local-register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, cb) => {
      try {
        const existingUser = await User.findOne({
          attributes: ["firstName", "email"],
          where: { [Op.or]: [{ username }, { email: req.body.email }] },
        });

        if (!existingUser) {
          const { firstName, lastName, email } = req.body;

          bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
              cb(err);
            }
            try {
              const newUser = await User.create({
                firstName,
                lastName,
                username,
                password: hash,
                email,
              });
              cb(null, {...newUser.dataValues, password: null});
            } catch (error) {
              cb(error.message);
            }
          });
        } else {
          cb(null, false, {
            message: "Username already registered, please login",
          });
        }
      } catch (error) {
        console.log(error);
        cb(error.message);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const [user, created] = await User.findOrCreate({
          where: {
            [Op.or]: [
              { username: profile.id },
              { email: profile.emails[0].value },
            ],
          },
          defaults: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            username: profile.id,
            password: "GOOGLE",
            email: profile.emails[0].value,
          },
        });

        return cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export default passport;
