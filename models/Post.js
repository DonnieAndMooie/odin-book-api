const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
  text: { type: String },
  picture: { type: Buffer },
  likes: [{ type: Schema.types.ObjectId, ref: "User" }],
  timestamp: { type: Date, required: true, default: Date.now() },
  author: { type: Schema.types.ObjectId, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
