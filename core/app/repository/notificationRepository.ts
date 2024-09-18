import { Notifcation, NotificationI } from "../../doamin/model/notificationModel";
import { createDefaultResponse, RepositoryResponse } from "./repoUtils";


class NotificationRepository {
  async create({ message, recipientId, read, recipientEmail, recipientName }: NotificationI): Promise<RepositoryResponse> {
    try {
      const data = await Notifcation.create({ message, recipientId, read, recipientName, recipientEmail })
      if (!data) return createDefaultResponse({ msg: "Notification can't be create" })
      return createDefaultResponse({ msg: "Notification created successfully", data })
    } catch (error) {
      const e = error as Error
      console.log(error)
      return createDefaultResponse({ msg: e.message })
    }
  }
}

export const notificationService = new NotificationRepository()
