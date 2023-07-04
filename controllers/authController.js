const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

exports.login = [
  // Validate email and password
  body("email")
    .trim()
    .isEmail()
    .escape()
    .withMessage("Please enter a valiid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be a least 6 characters"),

  async (req, res) => {
    // Return any errors
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.json(errors.array());
    }

    // Find user in database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "Could not find user" });
    }

    // Compare passwords and return token
    bcrypt.compare(req.body.password, user.password, (err, resolved) => {
      if (resolved) {
        const opts = {};
        opts.expiresIn = "24h";
        const secret = process.env.SECRET;
        const token = jwt.sign({ email: user.email }, secret, opts);
        return res.status(200).json({
          message: "Auth passed",
          token,
          user,
        });
      }
      res.status(401).json({ message: "Incorrect Password" });
    });
  },
];

exports.sign_up = [
  // Validatre user information
  body("email")
    .trim()
    .isEmail()
    .escape()
    .withMessage("Please enter a valid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be a least 6 characters"),
  body("name")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Name must be at least 5 characters"),

  (req, res, next) => {
    const errors = validationResult(req);

    // Return any errors
    if (errors.array().length > 0) {
      return res.json(errors.array());
    }

    next();
  },

  async (req, res) => {
    // Save user with hashed password
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name,
          friends: [],
        });
        const result = await user.save();
        res.json(result);
      } catch (error) {
        res.json({ message: "Failed to create user", error });
      }
    });
  },
];

exports.login_facebook = [
  // Authenticate with facebbok and return token for OdinBook
  passport.authenticate("facebook-token", { session: false }),
  function (req, res) {
    const opts = {};
    opts.expiresIn = "24h";
    const secret = process.env.SECRET;
    const token = jwt.sign({ email: req.user.email }, secret, opts);
    res.json({ token, user: req.user });
  },
];
