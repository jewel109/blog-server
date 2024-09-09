import mongoose, { model, Model, Schema, Types } from "mongoose";

export interface NotificationI extends Document {
  _id?: Types.ObjectId,
  message: string,
  recipientId: Types.ObjectId,
  read: boolean
}

const NotificationSchema = new Schema<NotificationI>({
  message: {
    type: String,
    required: true
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  read: {
    type: Boolean,
    required: true
  }
})


export const Notifcation = model("Notification", NotificationSchema)
