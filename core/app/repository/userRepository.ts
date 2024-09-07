import { userModel } from "../../doamin/model/userModel";
import { ERR_STATUS, SERVER_ERR_MSG, STATUS_CODE_201, STATUS_CODE_500, SUCCESS_RES_MSG, SUCCESS_STATUS, } from "../../../utils/responseDataUtils"
import { compareHashPassword, hashPassword } from "../../../utils/authUtils";
import jwt from 'jsonwebtoken'
import { jwtSecret } from "../../../utils/configUtils";

type RepositoryResponse<T = any> = {
  status: "success" | "error";
  msg: string;
  data: T | null;
  statusCode: number;
}
function createDefaultResponse<T>({
  status = "error",
  msg = "An error occurred", // Default message
  data = null,
  statusCode = 404,          // Default HTTP status code to 404
}: Partial<RepositoryResponse<T>> = {}): RepositoryResponse<T> {
  return {
    status,
    msg,
    data,
    statusCode,
  };
}
type UserT = {
  name: string,
  email: string,
  password: string
}

export default class UserRepository {
  async findbyEmail(email: string): Promise<RepositoryResponse> {
    try {

      const user = await userModel.findOne({ email: email })
      if (!user) return createDefaultResponse({ msg: "user is not fond with this email" })

      return createDefaultResponse({ msg: "Found the user", data: user, statusCode: 200, status: "success" })
    } catch (error) {

      const e = error as Error
      return createDefaultResponse({ msg: e.message })

    }
  }
  async regiser(name: string, email: string, password: string): Promise<RepositoryResponse> {

    try {

      const emailExist = await userModel.findOne({ email: email })

      if (emailExist) return createDefaultResponse({ msg: "Eamil already exist", statusCode: 401 })

      console.log(emailExist)

      const hashePassword = await hashPassword(password)

      const data = await userModel.create({ name, email, password: hashePassword })
      console.log(data)
      return createDefaultResponse({ data, msg: SUCCESS_RES_MSG, statusCode: STATUS_CODE_201, status: SUCCESS_STATUS, })
    } catch (error) {
      const e = error as Error
      return createDefaultResponse({ statusCode: STATUS_CODE_500 })
    }

  }

  async login(email: string, password: string): Promise<RepositoryResponse> {

    try {

      const emailExist = await userModel.findOne({ email: email })
      if (!emailExist) return createDefaultResponse({ msg: "Unauthorized access , This email is not registered" })

      const matchedPass = await compareHashPassword(password, emailExist.password)

      if (!matchedPass) return createDefaultResponse({ msg: "password is not matched" })

      const token = jwt.sign({ name: emailExist.name, email: email }, jwtSecret)
      if (!token) return createDefaultResponse({ msg: "Token is not  created" })


      return createDefaultResponse({ msg: SUCCESS_RES_MSG, statusCode: STATUS_CODE_201, status: "success", data: token })

    } catch (e) {
      const er = e as Error
      return createDefaultResponse({ msg: er.message, statusCode: STATUS_CODE_500 })
    }
  }
}


export const userService = new UserRepository()
