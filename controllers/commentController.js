const { body, validationResult } = require("express-validator");
const Comment = require("../models/Comment");

exports.comments_get = async (req, res) => {
  try {
    const comment = await Comment.find({ post: req.params.postId }).populate("author");
    res.json(comment);
  } catch (err) {
    res.json({ message: `Cannot find any comments on post with ID ${req.params.postId}` });
  }
};

exports.comment_get = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate("author");
    res.json(comment);
  } catch (err) {
    res.json({ message: `Could not find comment with ID ${req.params.commentId}` });
  }
};

exports.comment_post = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Comment must be at least 3 characters"),

  async (req, res) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.json(errors.array());
    }
    try {
      const comment = new Comment({
        text: req.body.text,
        likes: [],
        timestamp: Date.now(),
        author: req.user._id,
        post: req.params.postId,
      });
      await comment.save();
      res.json(comment);
    } catch (err) {
      res.json({ message: "There was an error when posting the comment" });
    }
  },
];

exports.comment_delete = async (req, res) => {
  try {
    const deletedPost = await Comment.findByIdAndDelete(req.params.commentId);
    res.json(deletedPost);
  } catch (err) {
    res.json({ message: `Could not delete post with ID ${req.params.commentId}` });
  }
};

exports.comment_update = async (req, res) => {
  try {
    const changes = {
      likes: req.body.likes,
    };
    const updatedResult = await Comment.findByIdAndUpdate(req.params.commentId, changes, { new: true });
    res.json(updatedResult);
  } catch (err) {
    res.json({ message: `Cannot update comment with the ID ${req.params.commentId}` });
  }
};
