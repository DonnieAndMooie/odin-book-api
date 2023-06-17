const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

exports.login = [
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

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.json(errors.array());
    }

    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    res.json(req.user);
  },
];

exports.sign_up = [
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
  body("name")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Name must be at least 5 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.json(errors.array());
    }

    next();
  },

  async (req, res) => {
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

exports.login_facebook = (req, res) => {

};
