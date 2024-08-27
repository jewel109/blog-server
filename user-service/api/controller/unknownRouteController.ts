import { sendResponse, withRequest } from "../../utils/controllerUtils";

export const unKnownRouteController = withRequest(async (req, res) => {

  console.log(req.url)
  return sendResponse(res, { msg: "This route is not find" })
})
