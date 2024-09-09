import mongoose, { model, Model, Schema, Types } from "mongoose";
export interface UserI {
  name: string
  email: string;
  password: string;
  role?: string;
  following?: Array<mongoose.Types.ObjectId>

}
export interface IUser extends UserI, Document {
  _id?: Types.ObjectId
  name: string
  email: string;
  password: string;
  role: string;
  following: Array<Types.ObjectId>
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
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
})

export const userModel = model('User', userSchema)
