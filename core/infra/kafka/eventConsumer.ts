import mongoose, { Types } from "mongoose";
import { kafkaUrl, mongoUrl } from "../../../utils/configUtils";
import { creatingConsumer, creatingKafkaInstance, KafkaCustomConfig, subscribingAngConsumingMsg } from "../../../utils/kafkaUtils";
import { userService } from "../../app/repository/userRepository";
import { notificationService } from "../../app/repository/notificationRepository";
import { indexNotification } from "../../../utils/elasticSearchUtils";

const config: KafkaCustomConfig = {
  clientId: "payment",
  broker: [kafkaUrl]
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

        console.log(userData, followeeData)

        const { status, data, msg: isFollowedMsg, statusCode } = await userService.isUserFollowed(userData.data, followeeData.data)
        if (isFollowedMsg == "so you are now following") {

          console.log("you can create notification")
        } else {
          console.log("can't create notification")
        }

        const notificationData = await notificationService.create({ message: notification, recipientId: userData.data._id, read: false, recipientEmail: userData.data.email, recipientName: userData.data.name })
        console.log("notificationData ", notificationData)

        await indexNotification({ recipientName: userData.data.name, recipientEmail: userData.data.email, read: false, message: notification })


      } else {
        console.log("something wrong")
      }

    })

  } catch (error) {
    console.log(error)
  }


}




consuming()
