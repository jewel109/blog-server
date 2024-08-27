const request = require("supertest")
const baseUrl = "http://localhost:9000/"
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const user = require("../model/user")
// const { expect } = require("chai")
const db = require("../helpers/db")


dotenv.config({
  path: "dev.env"
})
db.connectingToDB()


beforeAll(async () => {

  const data = await user.deleteMany({})

  // console.log(data)
})




describe("register a user ", () => {
  it("should create a jwt token", async () => {

    const response = await request(baseUrl).post("auth/register").send({ username: "jewels", email: "wj@gmail.com", password: "1235" })

    // console.log(response.body.token)

    process.env.TESTING_TOKEN = response.body.token
    // expect(response.body).toBe({})
    expect(response.status).toBe(201)

  })

  it("should return a jwt token", async () => {
    const response = await request(baseUrl).post("auth/login").send({ email: "wj@gmail.com", password: "1235" })
      .set('Authorization', `Bearer ${process.env.TESTING_TOKEN}`)


    const data = response.body
    // console.log(data)
    console.log("token is ", process.env.TESTING_TOKEN)
    expect(response.body).toHaveProperty("success")
    expect(response.status).toBe(201)
  })





  it("should give success message", async () => {

    const response = await request(baseUrl).post("auth/private").set('Authorization', `Bearer ${process.env.TESTING_TOKEN}`)

    expect(response.body).toHaveProperty('success')
    expect(response.status).toBe(200)

  })


})


