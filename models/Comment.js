const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String },
  likes: [{ type: Schema.types.ObjectId, ref: "User" }],
  timestamp: { type: Date, required: true, default: Date.now() },
  author: { type: Schema.types.ObjectId, required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
