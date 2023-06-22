const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  email: { type: String },
  password: { type: String },
  picture: { type: String, default: "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1" },
  facebookId: { type: String },
  requests_received: [{ type: Schema.Types.ObjectId, ref: "User" }],
  requests_sent: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", UserSchema);
