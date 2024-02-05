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
  location: [{
    value: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
  }],
  postImage: {
    data: String,
    contentType: String,
  },
  description: String,
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    }
  ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    }
  ],
 
  
    
  
});

const PostModel = mongoose.model("Postdata", postSchema);

module.exports = PostModel;
