const { newsfeedQueue } = require('../helpers/queue');

const mongoose = require("mongoose");
const user = require('../model/user');
const newsFeed = require('../model/newsFeed');
const Story = require('../model/story');
const amqplib = require("amqplib")


const start = async () => {

  try {
    const connect = await amqplib.connect("amqp://localhost")

    const channel = await connect.createChannel()
    // const processData = async msg => {
    //
    //   const id = JSON.parse(msg.content)
    //   // console.log(id)
    //
    //
    //
    //
    //
    // }
    //
    // const storyList = await Story.find({})
    //
    //
    //
    // // console.log("user ", userList)
    // console.log("story list ", storyList)
    //
    await channel.assertQueue(newsfeedQueue)
    channel.consume(newsfeedQueue, async (msg) => {

      const data = JSON.parse(msg.content)

      console.log(" ocnsume data ", data)
      const storyList = Story.find({}, (err, data) => {
        console.log("story data ", data)
      })



      // console.log("user ", userList)
      //

      channel.ack(msg)
    })

    // channel.purgeQueue(newsfeedQueue)

    //
    // const processQueue = async (msg) => {
    // const data = await user.findOne({ _id: mongoose.Types.ObjectId(id) })
    //
    // console.log(data)
    //
    // // creating a newsFeed 
    //
    // if (data) {
    //   const userFeed = await newsFeed.create({ user: data._id })
    //   console.log("user feed is ", userFeed)
    //


    // channel.ack(msg)
    // }



    // await new Promise((res, rej) => {
    //   channel.consume(newsfeedQueue, async (msg) => {
    //     const id = JSON.parse(msg.content)
    //
    //     console.log("consumed from newsfeedQueue ", id)
    //     const userList = await user.find({})
    //     const storyList = await Story.find({})
    //
    //
    //
    //     console.log("user ", userList)
    //     console.log("story list ", storyList)
    //
    //
    //
    //     res(msg)
    //   })
    // })

    // const storyList = await Story.find({})

    // await consumeFromQueue(newsfeedQueue, async (msg) => {
    //
    //   await processData(msg)
    // })

  } catch (error) {

    console.log(error)
  }

}


module.exports = { start }

