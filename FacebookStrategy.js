const FacebookTokenStrategy = require("passport-facebook-token");
const passport = require("passport");
const User = require("./models/User");

module.exports = new FacebookTokenStrategy({
  // Connect to my facebook app
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  fbGraphVersion: "v3.0",
}, (async (accessToken, refreshToken, profile, done) => {
  // Find OdinBook user linked to facebook account
  const user = await User.findOne({ facebookId: profile.id });
  if (user) {
    return done(null, user);
  }
  // If no user found, create new user
  const newUser = new User({
    facebookId: profile.id,
    name: profile.displayName,
    friends: [],
    picture: profile.photos[0].value,
    requests_received: [],
    requests_sent: [],
  });
  await newUser.save();
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  await User.findById(id, (err, user) => {
    done(err, user);
  });
});
