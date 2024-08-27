import mongoose, { model, Model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ]
})

export const userModel = model('User', userSchema)
