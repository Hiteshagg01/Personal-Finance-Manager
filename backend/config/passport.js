import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

import { User } from "../models/index.js";

passport.use(
  "local-login",
  new LocalStrategy(async (username, password, cb) => {
    try {
      const foundUser = await User.findOne({
        // attributes: ["firstName", "username", "password", "email"],
        where: {
          username: username,
        },
      });

      if (!foundUser) {
        cb("username and password does not match. Try again.");
      } else {
        bcrypt.compare(password, foundUser.dataValues.password, (err, same) => {
          if (err) {
            cb(err);
          } else if (same) {
            cb(null, foundUser);
          } else {
            cb("username and password does not match. Try again.");
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
          where: {
            username: username,
          },
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
              cb(null, newUser);
            } catch (error) {
              cb(error);
            }
          });
        } else {
          cb("username already registered, please login");
        }
      } catch (error) {
        cb("Cannot find user");
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

/*
Vivek Pandey
17:43
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy((username, password, done) => {
  if (username === user.username && password === user.password) {
    return done(null, user);
  }
  return done(null, false, { message: 'Incorrect credentials' });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (id === user.id) {
    done(null, user);
  } else {
    done(n
passport.deserializeUser((id, done) => {
  if (id === user.id) {
    done(null, user);
  } else {
    done(new Error('User not found'));
  }
});

// Routes
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: 'Logged in' });
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.status(200).json({ message: 'Logged out' });
  });
});
hoh-aowg-ukd
*/
