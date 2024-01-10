// PostModel.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: String,
    required: true,
    unique: true,
  },
  postImage: {
    data: String,
    contentType: String,
  },
  description: String,
  location: String,
});

const PostModel = mongoose.model("Postdata", postSchema);

module.exports = PostModel;
