const mongoose = require("mongoose")

async function connectingDB() {
  try {
    if (process.env.env == "testing") {
      mongoose.connect("mongodb://localhost:27017/blog-app-testing");
    } else {

      mongoose.connect("mongodb://localhost:27017/blog-app");
    }
    console.log("db running")
  } catch (err) {
    console.error(err)
  }

}

module.exports = connectingDB
