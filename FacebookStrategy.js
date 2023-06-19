const FacebookTokenStrategy = require("passport-facebook-token");
const passport = require("passport");
const User = require("./models/User");

module.exports = new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  fbGraphVersion: "v3.0",
}, (async (accessToken, refreshToken, profile, done) => {
  const user = await User.find({ facebookId: profile.id });
  if (user) {
    return done(null, user);
  }
  // Create new user
  console.log(profile);
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  await User.findById(id, (err, user) => {
    done(err, user);
  });
});
