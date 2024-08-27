import request from 'supertest'
import { mongoUrl, url } from '../../utils/configUtils'
import { ErrorResponseForTest } from '../../utils/controllerUtils'
import { ERR_STATUS, STATUS_CODE_200, STATUS_CODE_201, SUCCESS_RES_MSG, SUCCESS_STATUS } from '../../utils/responseDataUtils'
import mongoose from 'mongoose'
import { userModel } from '../../core/doamin/model/userModel'



beforeAll(async () => {

  await mongoose.connect(String(mongoUrl))
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

    const { body, statusCode } = await request(url).post('/api/v1/register').send({ name: "jewel", email: 'jewel@gmail.com', password: "1253" })

    const typeBody = body as ErrorResponseForTest

    console.log(typeBody.msg)

    expect(typeBody.msg).toBe(SUCCESS_RES_MSG)
    expect(typeBody.status).toBe(SUCCESS_STATUS)
    expect(statusCode).toBe(STATUS_CODE_201)
    expect(typeBody.data).not.toBe(null)

  })

})
