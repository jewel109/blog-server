import { createDefaultResponse, RepositoryResponse, tryCatchWithLogging } from "./repoUtils";


class NotificationRepository {
  @tryCatchWithLogging
  async create(): Promise<RepositoryResponse> {
    return createDefaultResponse({ msg: "done" })
  }
}

export const notificationService = new NotificationRepository()
