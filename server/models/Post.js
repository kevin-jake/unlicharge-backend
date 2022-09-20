const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: String, required: true },
  comments: [
    {
      body: { type: String, required: true },
      username: { type: String, required: true },
      createdAt: { type: String, required: true },
    },
  ],
  likes: [
    {
      username: { type: String, required: true },
      createdAt: { type: String, required: true },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Post", postSchema);
