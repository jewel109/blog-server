const mongoose = require("mongoose")
const request = require("supertest")
const dotenv = require("dotenv")
const user = require("../model/user")
const { connectingToDB } = require("../helpers/db")
const Story = require("../model/story")

dotenv.config({
  path: "dev.env"
})

let { ENV, TESTING_TOKEN, PORT, TESTING_URL } = process.env


connectingToDB()



beforeAll(async () => {
  await user.deleteMany({})
  await Story.deleteMany({})
})


describe("user will get access to private data", () => {


  it("Should create multiple users", async () => {


    const data = await user.insertMany([
      { username: "raihan", email: "raihan@gamil.com", password: "1235" },
      { username: "rana", email: "rana@gmail.com", password: "1235" },
      { username: "milon", email: "milon@gmail.com", password: "1235" },
      { username: "ruma", email: "ruma@gmail.com", password: "1235" }
    ])

    expect(data).not.toBe(null)
  })

  it("Should create multiple post ", async () => {

    const data = await Story.insertMany([
      { author: "raihan", title: "great post 1", content: "post is very great ok....." },
      { author: "rana", title: "great post 2", content: "post is very great ok....." },
      { author: "milon", title: "great post 3", content: "post is very great ok....." }


    ])



    expect(data).not.toBe(null)

  })


  it("should return all env data", async () => {


    console.log(ENV, TESTING_URL, TESTING_TOKEN, PORT)
    console.log(process.env.ENV)

  })


  it("should create a user ", async () => {
    const response = await request(TESTING_URL).post("auth/register").send({ username: "jewel rana", email: "wj56@gmail.com", password: "1235" })

    TESTING_TOKEN = response.body.token

    console.log(response.body)

    expect(response.status).toBe(201)
  })

  it("should return a jwt token", async () => {
    const response = await request(TESTING_URL).post("auth/login").send({ email: "wj56@gmail.com", password: "1235" })
      .set('Authorization', `Bearer ${process.env.TESTING_TOKEN}`)


    // const data = response.body
    // console.log(data)
    // console.log("token is ", TESTING_TOKEN)
    expect(response.body).toHaveProperty("success")
    expect(response.status).toBe(201)
  })
  it("should give access to the private route", async () => {

    const response = await request(TESTING_URL).post("auth/private").set('Authorization', `Bearer ${TESTING_TOKEN}`)

    console.log(response.body)
    expect(response.body).toHaveProperty('success')
    expect(response.status).toBe(200)

  })
})


