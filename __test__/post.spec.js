const db = require("../helpers/db")
const request = require('supertest')
const dotenv = require('dotenv')
const { testingToken } = require("./authentication-test.spec")
const Story = require("../model/story")
const { default: mongoose } = require("mongoose")
const User = require("../model/user")


dotenv.config({
  path: '../.env'
})


// console.log(" testing token for create ", testingToken)
db.connectingDB()

beforeAll(async () => {
  await Story.deleteMany({})
})

describe("Creating many user", () => {

  it("Should return sucess", async () => {

    try {

      const data = await User.insertMany([
        { username: "raihan", email: "raihan@gamil.com", password: "1235" },
        { username: "rana", email: "rana@gmail.com", password: "1235" },
        { username: "milon", email: "milon@gmail.com", password: "1235" },
        { username: "ruma", email: "ruma@gmail.com" }
      ])
      console.log(data)
    } catch (error) {

      console.log(error.message)
    }
  })
})

describe("create a post ", () => {

  it("should  have property success and return 200", async () => {

    // console.log('testing token ', process.env.TESTING_TOKEN)
    const response = await request(process.env.TESTING_URL).post("story/addstory").send({ title: "good", content: "very good raihanur rahman" }).set('Authorization', `Bearer ${process.env.TESTING_TOKEN}`)

    // console.log(response.body.data.slug) // slug of the story
    process.env.STORY_SLUG = response.body.data.slug
    // console.log(process.env.STORY_SLUG)
    expect(response.body).toHaveProperty("success")

    expect(response.status).toBe(200)

  })

})

describe("Get detail of a story", () => {

  it("Should return 200 and show the post details", async () => {
    const response = await request(process.env.TESTING_URL).post(`story/${process.env.STORY_SLUG}`).set('Authorization', `Bearer ${process.env.TESTING_TOKEN}`)
    console.log(response.body)
    expect(response.status).toBe(200)
  })
})
