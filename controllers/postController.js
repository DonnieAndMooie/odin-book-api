const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");

exports.post_get = async (req, res) => {
  try {
    const post = Post.findById(req.params.postId);
    res.json(post);
  } catch (err) {
    res.json({ message: `Could not find post with ID ${req.params.postId}` });
  }
};

exports.posts_get = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    res.json({ message: "Could not find any posts" });
  }
};

exports.post_post = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Text must be at least 3 characters"),

  async (req, res) => {
    try {
      const post = new Post({
        text: req.body.text,
        picture: req.body.picture,
        likes: [],
        timestamp: Date.now(),
        author: req.user._id,
      });
      await post.save();
      res.json(post);
    } catch (err) {
      res.json({ message: "There was an error when posting" });
    }
  },
];

exports.post_delete = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    res.json(deletedPost);
  } catch (err) {
    res.json({ message: `Cannot delete post with id of ${req.params.postId}` });
  }
};

exports.post_update = async (req, res) => {
  try {
    const changes = {
      likes: req.body.likes,
    };
    const updatedResult = await Post.findByIdAndUpdate(req.params.postId, changes, { new: true });
    res.json(updatedResult);
  } catch (err) {
    res.json({ message: `Cannot update post with the ID ${req.params.postId}` });
  }
};
