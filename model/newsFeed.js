const mongoose = require("mongoose")

const newsFeedSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    ref: "User"
  },
  StoryList: [{
    type: mongoose.Types.ObjectId
  }]
})


module.exports = mongoose.model("NewsFeed", newsFeedSchema)
