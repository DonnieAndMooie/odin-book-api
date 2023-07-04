const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");

exports.post_get = async (req, res) => {
  // Get specific post
  try {
    const post = await Post.findById(req.params.postId).populate("author");
    res.json(post);
  } catch (err) {
    res.json({ message: `Could not find post with ID ${req.params.postId}` });
  }
};

exports.posts_get = async (req, res) => {
  // Get all posts
  try {
    const posts = await Post.find({}).populate("author").sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.json({ message: "Could not find any posts" });
  }
};

exports.post_post = [
  // Validate post length
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Text must be at least 3 characters"),

  async (req, res) => {
    // Return any errors
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.json(errors.array());
    }

    try {
      // Save post to DB
      const post = new Post({
        text: req.body.text,
        picture: req.body.picture,
        likes: [],
        timestamp: Date.now(),
        author: req.user._id,
      });
      await post.save();
      const postPopulated = await post.populate("author");
      res.json(postPopulated);
    } catch (err) {
      res.json({ message: "There was an error when posting" });
    }
  },
];

exports.post_delete = async (req, res) => {
  // Delete specific post from DB
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    res.json(deletedPost);
  } catch (err) {
    res.json({ message: `Cannot delete post with id of ${req.params.postId}` });
  }
};

exports.post_update = async (req, res) => {
  try {
    // Update likes on post
    const changes = {
      likes: req.body.likes,
    };
    const updatedResult = await Post.findByIdAndUpdate(req.params.postId, changes, { new: true });
    res.json(updatedResult);
  } catch (err) {
    res.json({ message: `Cannot update post with the ID ${req.params.postId}` });
  }
};

exports.timeline = async (req, res) => {
  // Return only posts from friends sorted by timestamp
  try {
    const array = [...req.user.friends, req.user._id];
    const posts = await Post.find({
      author: { $in: array },
    }).populate("author").sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.json({ message: "Could not find any posts" });
  }
};

exports.other_posts = async (req, res) => {
  // Return all posts not from friends sorted by timestamp
  try {
    const array = [...req.user.friends, req.user._id];
    const posts = await Post.find({
      author: { $nin: array },
    }).populate("author").sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.json({ message: "Could not find any posts" });
  }
};
