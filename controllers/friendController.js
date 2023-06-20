const User = require("../models/User");

exports.friend_request = async (req, res) => {
  try {
    const requestedFriend = await User.findById(req.params.userId);
    requestedFriend.requests_received.push(req.user._id);
    await requestedFriend.save();
    req.user.requests_sent.push(req.params.userId);
    await req.user.save();
    res.json(requestedFriend);
  } catch (err) {
    res.json({ message: "Failed to send friend request", err: err.message });
  }
};

exports.accept_request = async (req, res) => {
  try {
    const [acceptedFriend, user] = await Promise.all([
      User.findById(req.params.userId),
      User.findById(req.user._id),
    ]);
    acceptedFriend.friends.push(req.user._id);
    user.friends.push(req.params.userId);
    user.requests_received = user.requests_received.filter((item) => item.toString() !== req.params.userId);
    acceptedFriend.requests_sent = acceptedFriend.requests_sent.filter((item) => item.toString() !== req.user._id.toString());
    await acceptedFriend.save();
    await user.save();
    res.json({ user, acceptedFriend });
  } catch (err) {
    res.json({ message: "Failed to accept friend request", err: err.message });
  }
};

exports.unfriend = async (req, res) => {
  try {
    const [friend, user] = await Promise.all([
      User.findById(req.params.userId),
      User.findById(req.user._id),
    ]);
    user.friends = user.friends.filter((item) => item.toString() !== req.params.userId);
    friend.friends = friend.friends.filter((item) => item.toString() !== req.user._id.toString());
    await user.save();
    await friend.save();
    res.json({ user, friend });
  } catch (err) {
    res.json({ message: "Failed to unfriend user" });
  }
};

exports.reject_request = async (req, res) => {
  try {
    const [requester, user] = await Promise.all([
      User.findById(req.params.userId),
      User.findById(req.user._id),
    ]);
    requester.requests_sent = requester.requests_sent.filter((item) => item.toString() !== user._id.toString());
    user.requests_received = user.requests_received.filter((item) => item.toString() !== req.params.userId);
    await requester.save();
    await user.save();
    res.json({ requester, user });
  } catch (err) {
    res.json({ message: "Could not reject friend request" });
  }
};
