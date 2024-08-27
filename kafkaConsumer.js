const { Kafka } = require("kafkajs")
const { newsfeedQueue } = require("./helpers/queue")
const dotenv = require('dotenv')
const { createPostTopic } = require("./config")
const { connectingToDB } = require("./helpers/db")
const user = require("./model/user")
const { default: mongoose } = require("mongoose")

const kafka = new Kafka({
  clientId: "consumer",
  brokers: ["localhost:9093"]
})

dotenv.config({
  path: "dev.env"
})

connectingToDB()

const admin = kafka.admin()
const kafkaAdmin = async () => {

  try {

    console.log("connecting to admin")
    await admin.connect()

    await admin.createTopics({
      topics: [
        {
          topic: newsfeedQueue,
          numPartitions: 2
        },
        {
          topic: createPostTopic,
          numPartitions: 2
        }
      ]
    })

    console.log("admin disconnected")
    await admin.disconnect()
  } catch (error) {

    console.error(error)

  }


}

kafkaAdmin()

const consumer = kafka.consumer({ groupId: "login" })
const createTopicsConsumer = kafka.consumer({ groupId: "create-post" })

const RunConsumers = async () => {
  try {

    await consumer.connect()
    await consumer.subscribe({ topic: process.env.NEWS_FEED_TOPIC })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(), offset: message.offset
        })
        // await consumer.commitOffsets([{ topic, partition, offset: message.offset + 1 }]);
      }
    })

    await createTopicsConsumer.connect()
    await createTopicsConsumer.subscribe({ topic: createPostTopic })
    await createTopicsConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { postId, userId } = JSON.parse(message.value)
        console.log(postId, userId)


        const follower = await user.findOne({ _id: mongoose.Types.ObjectId(userId) })
        console.log(follower)


      }
    })
  } catch (error) {

    console.log(error)
  }


}


RunConsumers()




