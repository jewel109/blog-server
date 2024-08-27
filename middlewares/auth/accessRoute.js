const asyncError = require('express-async-handler')
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require('../../helpers/auth/tokenHelper')
const User = require('../../model/user')
const CustomError = require('../Error/CustomError')
const { log, chalk } = require('../../controllers/comment/comment')
const { sendStatusError } = require('../../helpers/httpError')
const verifyToken = require('../../helpers/tokenVerify')
const { newsfeedQueue } = require('../../helpers/queue')

const redis = require("redis")
const dotenv = require("dotenv")



const { Kafka } = require("kafkajs")
const { redisClient } = require('../../helpers/db')

const kafka = new Kafka({
  clientId: "consumer",
  brokers: ["localhost:9093"]
})

dotenv.config({
  path: "dev.env"
})


const { NEWS_FEED_TOPIC } = process.env
// console.log("topic", NEWS_FEED_TOPIC)

const getAccessToRoute = asyncError(async (req, res, next) => {

  try {
    const { JWT_SECRET } = process.env
    // console.log(JWT_SECRET)

    if (!isTokenIncluded(req, res)) {
      // log(chalk("no token found"))
      return sendStatusError(res, 404, "no token found")
    }

    const accessToken = getAccessTokenFromHeader(req, res)

    if (accessToken === 'null') {

      return sendStatusError(res, 404, "accessToken is null")
    } else if (accessToken != 'null') {
      // console.log(accessToken)

      const { decoded, tokenError } = verifyToken(accessToken)
      // console.log("decoded is ", decoded)
      if (tokenError) {

        console.log(tokenError)
        return sendStatusError(res, 404, tokenError)
      }
      // console.log(`decoded jsonwebtoken ${decoded}`)

      const user = await User.findById(decoded.id)
      // console.log(`in accessroute ${user}`)
      console.log("found user")

      if (!user) {
        console.log('no user')
        return sendStatusError(res, 404, "no user found")
      }


      const value = await redisClient.get('key')
      console.log("cache value ", value)
      const producer = kafka.producer()

      await producer.connect()
      const result = await producer.send({
        topic: NEWS_FEED_TOPIC,
        messages: [
          { value: JSON.stringify(user._id) }
        ]
      })
      console.log(result)
      await producer.disconnect()
      req.user = user
      next()
    }
  } catch (err) {
    sendStatusError(res, 500, err.message)
  }
})

module.exports = { getAccessToRoute, kafka }
