import mongoose from 'mongoose'
import request from 'supertest'
import { UserI, userModel } from '../../core/doamin/model/userModel'
import { mongoUrl, url } from '../../utils/configUtils'
import { ResponseForTest } from '../../utils/controllerUtils'
import { STATUS_CODE_200, STATUS_CODE_201, SUCCESS_RES_MSG, SUCCESS_STATUS } from '../../utils/responseDataUtils'

export const userData: UserI = {
  name: "jewel", email: "jewel@gmail.com", password: "1253"
}

export const registerTest = async (userData: UserI) => await request(url).post('/api/v1/register').send(userData)
export const loginTest = async (userData: UserI) => await request(url).post('/api/v1/login').send(userData)
beforeAll(async () => {

  await mongoose.connect(String(mongoUrl))
  await userModel.deleteMany({})
})


describe("Handling invalid route request", () => {

  test("should return a  error status with 404", async () => {


    const { body, statusCode } = await request(url).post('/')
    console.log(body)
    expect(body.status).toBe("error")
    expect(statusCode).toBe(404)
    expect(body.data).toBe(null)
  })


})


describe("Handling register route request", () => {

  beforeAll(async () => {
    await userModel.deleteMany({})
  })

  test("Sholud return success status with 201", async () => {

    const { body, statusCode } = await registerTest(userData)
    const typeBody = body as ResponseForTest

    console.log(typeBody.msg)

    expect(typeBody.msg).toBe(SUCCESS_RES_MSG)
    expect(typeBody.status).toBe(SUCCESS_STATUS)
    expect(statusCode).toBe(STATUS_CODE_201)
    expect(typeBody.data).not.toBe(null)

  })

})

describe("Handling Login route", () => {

  beforeAll(async () => {
    await userModel.deleteMany({})
  })

  test("Sholud return success status with 201", async () => {

    const { body, statusCode } = await registerTest(userData)
    const typeBody = body as ResponseForTest

    console.log(typeBody.msg)

    expect(typeBody.msg).toBe(SUCCESS_RES_MSG)
    expect(typeBody.status).toBe(SUCCESS_STATUS)
    expect(statusCode).toBe(STATUS_CODE_201)
    expect(typeBody.data).not.toBe(null)

  })
  test("should return success status having the token with 201 statusCode", async () => {
    const { body, statusCode } = await loginTest(userData)
    const tBody = body as ResponseForTest
    console.log(tBody)
    expect(tBody.msg).toBe(SUCCESS_RES_MSG)
    expect(tBody.data.token).not.toBe(null)
    expect(statusCode).toBe(STATUS_CODE_201)

  })
})

describe("Middleware for accessing to private route", () => {

  let token = ""
  beforeAll(async () => {
    const { body, statusCode } = await loginTest(userData)
    const tBody = body as ResponseForTest
    console.log(tBody)
    expect(tBody.msg).toBe(SUCCESS_RES_MSG)
    expect(tBody.data).not.toBe(null)
    expect(statusCode).toBe(STATUS_CODE_201)
    token = tBody.data
    console.log("token ", tBody.data)

  })

  test("should have user data in the request object", async () => {

    const { body, statusCode } = await request(url).post('/api/v1/private').set('Authorization', `bearer ${token}`)

    const tBody = body as ResponseForTest
    expect(tBody.msg).toBe(SUCCESS_RES_MSG)
    expect(tBody.data).not.toBe(null)
    expect(statusCode).toBe(STATUS_CODE_200)
    console.log(tBody)

  })
})

describe("Handling following a user", () => {
  let token = ''
  beforeAll(async () => {

    try {
      await userModel.insertMany([
        { name: "raihan", email: "raihan@gmail.com", password: '1234' }
      ])
      const { body, statusCode } = await loginTest(userData)
      const tBody = body as ResponseForTest
      // console.log(tBody)
      expect(tBody.msg).toBe(SUCCESS_RES_MSG)
      expect(tBody.data).not.toBe(null)
      expect(statusCode).toBe(STATUS_CODE_201)
      token = tBody.data
      // console.log("token ", tBody.data)



    } catch (error) {
      console.log(error);

    }
  })
  // when raihan will follow jewel 
  // raihan will follow by sending request to server with followee name(raihan) and he's id(raihan)
  // after finding the followee (jewel) by his name , he's id (raihan) will push to the following 
  // array of followee(jewel)
  // after successfull follow raihan will get a notification that he is following jewel
  // and jewel will get notification that he is being followed by raihan
  test("should have success status and 201 ", async () => {

    const { body, statusCode } = await request(url).post('/api/v1/follow').send({ followeeEmail: 'raihan@gmail.com' }).set('Authorization', `bearer ${token}`)

    const tBody = body as ResponseForTest
    expect(tBody.msg).toBe("Great you are now following ")
    expect(tBody.data).not.toBe(null)
    expect(statusCode).toBe(STATUS_CODE_201)


  })
  test("should have follow  ", async () => {

    const { body, statusCode } = await request(url).post('/api/v1/follow').send({ followeeEmail: 'raihan@gmail.com' }).set('Authorization', `bearer ${token}`)

    const tBody = body as ResponseForTest
    console.log(tBody.data)
    expect(tBody.msg).toBe("so you are now following")
    expect(tBody.data).not.toBe(null)
    expect(statusCode).toBe(STATUS_CODE_201)


  })

  test("should make a notification", async () => {

  })


})
