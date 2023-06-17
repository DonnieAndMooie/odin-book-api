const User = require("../models/User");

exports.users_get = async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.json(users);
  } else {
    res.json({ message: "No users found" });
  }
};

exports.user_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    res.json({ message: `No user found with the id ${req.params.userId}` });
  }
};

exports.user_update = async (req, res) => {
  const changes = {
    friends: req.body.friends,
    picture: req.body.picture,
  };
  try {
    const updatedResult = await User.findByIdAndUpdate(req.params.userId, changes, { new: true });
    return res.json(updatedResult);
  } catch (err) {
    res.json({ message: `No user found with the id ${req.params.userId}` });
  }
};
