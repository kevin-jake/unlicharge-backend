const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  mobile_number: { type: String, required: true },
  createdAt: { type: String, required: true },
  last_login: { type: String, required: true },
  signed_using: { type: String },
  fb_id: { type: String },
  address: { type: String },
  image_url: { type: String },
});

module.exports = model("User", userSchema);
