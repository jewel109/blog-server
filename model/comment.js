const mongoose = require("mongoose")


const CommentSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'refModel'
  },
  refModel: {
    type: String,
    required: true,
    enum: ['Story', 'Comment']
  },

  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    ref: "User",
    required: true
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  replies: [{
    type: mongoose.Types.ObjectId,
    ref: "Comment"
  }],
  likeCount: {
    type: Number,
    default: 0
  },

}, { timestamps: true })

const Comment = mongoose.model("Comment", CommentSchema)


module.exports = Comment
