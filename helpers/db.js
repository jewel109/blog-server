const mongoose = require("mongoose")
const amqplib = require("amqplib")
let channel

async function connectingDB() {
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

async function connectToampqplib() {
  try {
    const connect = await amqplib.connect("amqp://localhost")

    channel = await connect.createChannel()
    channel.assertQueue("FOUND_POST", 'direct', { durable: false })

    channel.consume('CREATE_POST', (msg) => {
      console.log("data from messge broker", JSON.parse(msg.content))
      channel.ack(msg)

    })


    channel.consume('FOUND_POST', (data) => {
      console.log("data from CREATE_POST", JSON.parse(data.content))
      channel.ack(data)
    })



  } catch (error) {

    console.error(error)
  }

}

module.exports = { connectingDB, connectToampqplib }
