const db = require("../helpers/db")
const request = require('supertest')
const dotenv = require('dotenv')
const { testingToken } = require("./authentication-test.spec")
const Story = require("../model/story")


dotenv.config({
  path: '../.env'
})


// console.log(" testing token for create ", testingToken)
db()

beforeAll(async () => {
  await Story.deleteMany({})
})

describe("create a post ", () => {

  it("should  have property success and return 200", async () => {

    // console.log('testing token ', process.env.TESTING_TOKEN)
    const response = await request(process.env.TESTING_URL).post("story/addstory").send({ title: "good", content: "very good raihanur rahman" }).set('Authorization', `Bearer ${process.env.TESTING_TOKEN}`)

    expect(response.body).toHaveProperty("success")

    expect(response.status).toBe(200)

  })

})

