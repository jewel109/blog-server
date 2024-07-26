const db = require("../helpers/db")
const request = require('supertest')
const dotenv = require('dotenv')
const { testingToken } = require("./authentication-test.spec")
const Story = require("../model/story")
const Comment = require("../model/comment")


dotenv.config({
  path: '../.env'
})


// console.log(" testing token for create ", testingToken)
db.connectingDB()

beforeAll(async () => {
  await Story.deleteMany({})
  await Comment.deleteMany({})
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

describe("Create a comment to a post", () => {

  it("Should return 200 and show the comment details", async () => {
    const response = await request(process.env.TESTING_URL).post(`comment/${process.env.STORY_SLUG}/addcomment`).send({ content: "great post" }).set('Authorization', `Bearer ${process.env.TESTING_TOKEN}`)
    console.log(response.body)
    expect(response.status).toBe(200)
  })
})
