import { model, Schema, Types } from "mongoose";
export interface NotificationI {
  message: string,
  recipientId?: string,
  read: boolean,
  recipientEmail: string,
  recipientName: string
}

export interface NotificationwithDocI extends Omit<NotificationI, 'recipientId'>, Document {
  _id?: Types.ObjectId,
  message: string,
  recipientId: Types.ObjectId,
  read: boolean,
  recipientName: string,
  recipientEmail: string
}

const NotificationSchema = new Schema<NotificationwithDocI>({
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
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  }
})


export const Notifcation = model("Notification", NotificationSchema)
