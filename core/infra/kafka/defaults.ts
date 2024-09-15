import { creatingKafkaInstance, KafkaCustomConfig } from "../../../utils/kafkaUtils"
import { kafkaUrl } from "../../../utils/configUtils"
const config: KafkaCustomConfig = {
  clientId: "payment",
  broker: [kafkaUrl]
}

export const kafkaInstance = creatingKafkaInstance(config)

