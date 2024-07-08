const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  sendingTo: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })


module.exports = mongoose.model("Notification", notificationSchema)
