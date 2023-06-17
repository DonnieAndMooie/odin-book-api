const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("./models/User");

module.exports = new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        return done(null, user);
      }
      return done(null, false, { message: "Incorrect Password" });
    });
  } catch (err) {
    return done(err);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
