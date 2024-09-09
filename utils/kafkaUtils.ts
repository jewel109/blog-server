import { Kafka, Producer, Consumer, Admin } from "kafkajs";

export interface KafkaCustomConfig {
  clientId: string
  broker: string[]
  groupId?: string
}


export const creatingKafkaInstance = (config: KafkaCustomConfig) => {
  return new Kafka({
    clientId: config.clientId,
    brokers: config.broker
  })
}


export const creatingProducer = async (kafka: Kafka): Promise<Producer> => {
  const producer = kafka.producer()
  await producer.connect()
  return producer
}


export const sendingMessage = async (
  producer: Producer,
  topic: string,
  messages: { key: string; value: string }[]
): Promise<void> => {
  await producer.send({
    topic,
    messages: messages.map(msg => ({ key: msg.key, value: msg.value }))
  })
}


export const creatingConsumer = async (kafka: Kafka, groupId: string): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId })
  await consumer.connect()
  return consumer
}


export const subscribingAngConsumingMsg = async (
  consumer: Consumer,
  topic: string,
  eachMessageCallback: (message: { key: Buffer | null; value: Buffer | null }) => void
): Promise<void> => {
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      eachMessageCallback(message)
    }
  })
}

export const adminCreation = async (kafka: Kafka): Promise<Admin> => {
  const admin = kafka.admin()
  // console.log("admin creation ", admin)
  await admin.connect()
  return admin
}


export const createTopic = async (admin: Admin, topic: string): Promise<void> => {
  const topicsExist = await admin.listTopics();
  if (!topicsExist.includes(topic)) {
    await admin.createTopics({
      topics: [{ topic }],
    });
    console.log(`Topic "${topic}" created successfully.`);
  } else {
    console.log(`Topic "${topic}" already exists.`);
  }
};


export const deleteTopic = async (admin: Admin, topic: string): Promise<void> => {
  const topicsExist = await admin.listTopics();
  if (topicsExist.includes(topic)) {
    await admin.deleteTopics({
      topics: [topic],
    });
    console.log(`Topic "${topic}" deleted successfully.`);
  } else {
    console.log(`Topic "${topic}" does not exist.`);
  }
}


export const listTopics = async (admin: Admin): Promise<void> => {
  const topics = await admin.listTopics();
  console.log('Available topics:', topics);
}



