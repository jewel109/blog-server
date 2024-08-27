import { userModel } from "../../doamin/model/userModel";
import { STATUS_CODE_201, STATUS_CODE_500, SUCCESS_RES_MSG, SUCCESS_STATUS, } from "../../../utils/responseDataUtils"
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
  async regiser(name: string, email: string, password: string): Promise<RepositoryResponse> {

    try {

      const emailExist = await userModel.findOne({ email: email })

      if (emailExist) return createDefaultResponse({ msg: "Eamil already exist", statusCode: 401 })

      console.log(emailExist)

      const data = await userModel.create({ name, email, password })
      console.log(data)
      return createDefaultResponse({ data, msg: SUCCESS_RES_MSG, statusCode: STATUS_CODE_201, status: SUCCESS_STATUS })
    } catch (error) {
      const e = error as Error
      return createDefaultResponse({ statusCode: STATUS_CODE_500 })
    }

  }
}
