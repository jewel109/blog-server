const mongoose = require("mongoose")
const redis = require("redis")
async function connectingToDB() {
  try {
    if (process.env.ENV == "testing") {
      mongoose.connect("mongodb://localhost:27017/blog-app-testing");
      console.log("we are in test environment")
    } else {

      mongoose.connect("mongodb://localhost:27017/blog-app");
    }
    console.log("db running")
  } catch (err) {
    console.error(err)
  }

}

const redisClient = redis.createClient({ url: "redis://localhost:6389" })


redisClient.connect().then(() => {
  console.log("redis is connected")
})




module.exports = { connectingToDB, redisClient }
