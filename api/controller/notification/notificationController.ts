import { tryCatchWithLogging } from "../../../core/app/repository/repoUtils";
import { tcWrapper, withRequest } from "../../../utils/controllerUtils";


export const notificationController = withRequest(async (req, res) => {
  const result = tcWrapper(() => {
    throw new Error("got an error")

  })
  console.log(result)
})
