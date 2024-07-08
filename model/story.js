const mongoose = require('mongoose')
const slugify = require('slugify')
const Comment = require('./comment')


const StorySchema = new mongoose.Schema({
  author: {
    type: String,
    ref: "User",
    required: true
  },
  slug: String,
  title: {
    type: String,
    required: [true, "please provide a title"],
    minlength: [4, "Please provide a title at least 4 character"],
    unique: true
  },
  content: {
    required: true,
    type: String,
    minlength: [10, "At least 10 character"]
  },
  image: {
    type: String,
    default: "post.png"
  },
  readTime: {
    type: Number,
    default: 3
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.ObjectId,
    ref: "Comment"
  }],
  commentCount: {
    type: Number,
    default: 0
  },
}, { timestamps: true })

StorySchema.pre("save", function(next) {
  if (!this.isModified("title")) {
    next()
  }

  this.slug = this.makeSlug()
  next()
})

// StorySchema.pre('remove', async function() {
//
//   const story = await Story.findById(this._id)
//
//   await Comment.deleteMany({
//     story: story
//   })
// })

StorySchema.methods.makeSlug = function() {
  return slugify(this.title, {
    replacement: '-',
    remove: /[*+~.()'"!:@/?]/g,
    lower: true, strict: false, locale: 'tr',
    trim: true
  })
}



const Story = mongoose.model("Story", StorySchema)

module.exports = Story


