import { Request } from 'express'
import jwt from 'jsonwebtoken'
import UserRepository from "../../../core/app/repository/userRepository"
import { IUser } from "../../../core/doamin/model/userModel"
import { jwtSecret } from "../../../utils/configUtils"
import { sendResponse, withRequest } from "../../../utils/controllerUtils"
import { SERVER_ERR_MSG, STATUS_CODE_200, SUCCESS_RES_MSG } from "../../../utils/responseDataUtils"

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


export const loginRouterHandler = withRequest(async (req, res) => {

  const { email, password } = req.body

  if (!email) return sendResponse(res, { msg: "Unauthorized access , please provide a email" })
  if (!password) return sendResponse(res, { msg: "Unauthorized access , please provide a password" })
  if (String(password).length < 4) return sendResponse(res, { msg: "Unauthorized access , please provide a password" })

  const { data, msg, status, statusCode } = await userService.login(email, password)

  return sendResponse(res, { data, msg, statusCode, status })



})


export interface AuthenticatedUserT extends AuthUserT {
  userData?: IUser
}

interface IJWtUser {
  email: string
}
interface AuthUserT extends Request {
  user?: IJWtUser;
}
export const resourceAccessController = withRequest<AuthUserT>(async (req, res, next) => {

  try {

    const authorization = req.headers.authorization
    // console.log("authorization is ", authorization)

    if (!authorization) return sendResponse(res, { status: 'error', statusCode: 401, msg: "authorization in header is not found" })

    const token = authorization.split(" ")[1]

    const data = jwt.verify(token, jwtSecret)

    console.log(data)

    if (!data || typeof data === 'string') return sendResponse(res, { status: 'error', statusCode: 401, msg: "jwt can't verify the token" })


    req.user = data as IJWtUser
    return next()


  } catch (error) {

    const e = error as Error
    sendResponse(res, { msg: e.message, statusCode: 500 })

  }
})

export const getResource = withRequest<AuthUserT>(async (req, res) => {
  try {

    const user = req.user
    if (!user) return sendResponse(res, { msg: "User is not found ", statusCode: 404 })
    return sendResponse(res, { status: "success", msg: SUCCESS_RES_MSG, statusCode: STATUS_CODE_200, data: user })
  } catch (error) {
    const e = error as Error
    sendResponse(res, { msg: e.message, statusCode: 500 })

  }
})


export const authenticatedUserController = withRequest<AuthenticatedUserT>(async (req, res, next) => {
  try {
    const { email } = req.user as IJWtUser

    const { statusCode, status, data, msg } = await userService.findbyEmail(email)

    if (status === "error") return sendResponse(res, { msg, statusCode })
    req.userData = data
    next()
  } catch (error) {
    const e = error as Error
    return sendResponse(res, { msg: e.message, statusCode: 500 })
  }


})
