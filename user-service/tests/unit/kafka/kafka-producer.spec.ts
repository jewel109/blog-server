import { Kafka, KafkaMessage } from "kafkajs"

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9093'],
})
describe("Testing Kafka Connection ", () => {

  test("should connect to kafka", async () => {

    const producer = kafka.producer();
    await producer.connect();

    // Expect producer to be connected
    expect(producer).toHaveProperty('connect');
    // expect(producer.connect).toBe(true);

    // Produce a message
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: JSON.stringify("great") },
      ],
    });
    await producer.disconnect()
  })
})
