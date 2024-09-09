import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { compareHashPassword, hashPassword } from "../../../utils/authUtils";
import { jwtSecret } from "../../../utils/configUtils";
import { STATUS_CODE_201, STATUS_CODE_500, SUCCESS_RES_MSG, SUCCESS_STATUS } from "../../../utils/responseDataUtils";
import { IUser, userModel } from "../../doamin/model/userModel";
import { createDefaultResponse, RepositoryResponse } from './repoUtils';


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

      const token = jwt.sign({ email: email }, jwtSecret)
      if (!token) return createDefaultResponse({ msg: "Token is not  created" })


      return createDefaultResponse({ msg: SUCCESS_RES_MSG, statusCode: STATUS_CODE_201, status: "success", data: token })

    } catch (e) {
      const er = e as Error
      return createDefaultResponse({ msg: er.message, statusCode: STATUS_CODE_500 })
    }
  }

  async isUserFollowed(user: IUser, followeeData: IUser): Promise<RepositoryResponse> {

    try {

      console.log("user ", user)
      console.log("followee ", followeeData)
      const data = await userModel.findOne({ email: user.email, following: { $in: [new Types.ObjectId(followeeData._id)] } })

      console.log("user having the following ", data)

      if (!data) return createDefaultResponse({ data: false, statusCode: 200, status: "success", msg: "false" })
      return createDefaultResponse({ msg: "so you are now following", statusCode: 201, status: "success", data: true })
    } catch (error) {
      const e = error as Error
      return createDefaultResponse({ msg: e.message, statusCode: 500 })
    }
  }

  async addToFollowingField(user: IUser, followeeData: IUser): Promise<RepositoryResponse> {
    try {

      const foundFolloweeData = await userModel.findOneAndUpdate({ email: user.email }, {
        $addToSet: {
          following: new Types.ObjectId(followeeData._id)
        },
      }, { new: true })
      console.log('followeeData ', foundFolloweeData)
      if (!foundFolloweeData) {
        return createDefaultResponse({ msg: "you have not follwing yet", statusCode: 403 })
      }
      return createDefaultResponse({ msg: "Great you are now following ", statusCode: 201, status: 'success', data: foundFolloweeData })

    } catch (error) {
      const e = error as Error
      return createDefaultResponse({ msg: e.message, statusCode: 500 })
    }
  }

  async romoveFromFollowingField(user: IUser, followee: IUser): Promise<RepositoryResponse> {
    try {
      return createDefaultResponse({ msg: "great" })
    } catch (error) {
      const e = error as Error

      return createDefaultResponse({ msg: e.message })
    }
  }
}


export const userService = new UserRepository()
