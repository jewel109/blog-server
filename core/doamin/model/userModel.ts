import mongoose, { model, Model, Schema, Types } from "mongoose";
export interface IUser extends Document {
  _id?: Types.ObjectId
  name: string
  email: string;
  password: string;
  role: string;
  following: Array<mongoose.Types.ObjectId>
}
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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
