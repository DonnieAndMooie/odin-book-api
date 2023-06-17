const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  email: { type: String },
  password: { type: String },

});

module.exports = mongoose.model("User", UserSchema);
