require('dotenv').config({ path: "dev.env" })

const { PORT, CREATE_POST_TOPIC, } = process.env

console.log("createPostTopic ", CREATE_POST_TOPIC)

exports.createPostTopic = CREATE_POST_TOPIC
