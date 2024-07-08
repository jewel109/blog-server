const request = require("supertest")
const baseUrl = "http://localhost:9000/"

const mongoose = require("mongoose")
const express = require("express")
// beforeAll(async () => {
//   async function connectingDB() {
//     try {
//       mongoose.connect("mongodb://localhost:27017/blog-app-testing");
//       console.log("db running")
//     } catch (err) {
//       console.error(err)
//     }
//
//   }
//   await connectingDB()
// })
afterEach(async () => {
  const collections = mongoose.connection.collections;
  // for (const key in collections) {
  //   const collection = collections[key];
  //   await collection.deleteMany({});
  // }
  console.log("db cleaned up")
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log("db closed")
});




describe("getting authentication route", () => {



  it("should return succes", async () => {
    return request(baseUrl)
      .get("story/getallstories")
      .expect(200)

  })
})
