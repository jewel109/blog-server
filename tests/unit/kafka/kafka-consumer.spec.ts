import { Kafka, KafkaMessage } from "kafkajs"
import { kafkaUrl } from "../../../utils/configUtils";

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [kafkaUrl],
})
describe("Testing Kafka Connection ", () => {

  test("should connect to kafka", async () => {


    const consumer = kafka.consumer({ groupId: 'test-group' });
    await consumer.connect();

    // Expect consumer to be connected
    expect(consumer).toHaveProperty('connect');

    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    // Consume the message
    const messages: any = [];
    const messagePromise = new Promise<void>((resolve) => {
      consumer.run({
        eachMessage: async ({ topic, partition, message }: { topic: string, partition: number, message: KafkaMessage }) => {
          if (message.value) {

            const messageContent = message.value.toString()
            messages.push(JSON.parse(messageContent));
          }
          resolve(); // Resolve the promise once the message is consumed
        },
      });
    });    // Expect the message to be consumed

    await messagePromise
    console.log(messages)
    expect(messages).toContain('great');

    await consumer.disconnect()
  }, 20000)
})
