import { Kafka, KafkaConfig } from "kafkajs";
import { creatingConsumer, creatingKafkaInstance, KafkaCustomConfig, subscribingAngConsumingMsg } from "../../../utils/kafkaUtils";
import { userService } from "../../app/repository/userRepository";
import mongoose from "mongoose";
import { mongoUrl } from "../../../utils/configUtils";

const config: KafkaCustomConfig = {
  clientId: "payment",
  broker: ["localhost:9093"]
}



export interface ConsumingNotificationI {
  userEmail: string, followeeEmail: string, notification: string
}
const kafkaInstance = creatingKafkaInstance(config)
console.log("working  ..")
const consuming = async () => {

  try {
    const conn = await mongoose.connect(String(mongoUrl), {
    });
    console.log("running ...")

    const consumer = await creatingConsumer(kafkaInstance, 'follow')

    // console.log(consumer)

    await subscribingAngConsumingMsg(consumer, 'follow', async msg => {
      if (msg.key && msg.value) {
        const key = JSON.parse(msg.key.toString())
        const { notification, followeeEmail, userEmail } = JSON.parse(msg.value.toString()) as ConsumingNotificationI

        console.log({
          notification, userEmail, followeeEmail
        })


        const userData = await userService.findbyEmail(userEmail)
        const followeeData = await userService.findbyEmail(followeeEmail)

        // console.log(userData, followeeData)

        const { status, data, msg: isFollowedMsg, statusCode } = await userService.isUserFollowed(userData.data, followeeData.data)
        if (isFollowedMsg == "so you are now following") {

          console.log("you can create notification")
        } else {
          console.log("can't create notification")
        }

      } else {
        console.log("something wrong")
      }

    })

  } catch (error) {
    console.log(error)
  }


}




consuming()
