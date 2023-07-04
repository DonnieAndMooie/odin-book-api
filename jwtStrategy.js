const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const passport = require("passport");
const User = require("./models/User");

const opts = {};
// Save token as Bearer header
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

module.exports = new JwtStrategy(opts, async (payload, done) => {
  // Find user from email
  const user = await User.findOne({ email: payload.email });
  if (user) {
    return done(null, user);
  }
  return done(null, false, { message: "User does not exist" });
});
