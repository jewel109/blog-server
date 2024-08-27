import UserRepository from "../../core/app/repository/userRepository"
import { sendResponse, withRequest } from "../../utils/controllerUtils"
import { ERR_STATUS, NOT_FOUND_MSG, SERVER_ERR_MSG } from "../../utils/responseDataUtils"

const userService = new UserRepository()

export const registerController = withRequest(async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name) return sendResponse(res, { msg: "Unauthorized access , please provide a name" })
    if (!email) return sendResponse(res, { msg: "Unauthorized access , please provide a email" })
    if (!password) return sendResponse(res, { msg: "Unauthorized access , please provide a password" })
    if (String(password).length < 4) return sendResponse(res, { msg: "Unauthorized access , please provide a password" })

    const { data, msg, status, statusCode } = await userService.regiser(name, email, password)


    return sendResponse(res, { msg, status, statusCode, data })

  } catch (error) {
    const e = error as Error
    sendResponse(res, { msg: SERVER_ERR_MSG })
  }


})
