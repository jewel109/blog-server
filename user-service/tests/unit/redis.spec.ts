import { createClient } from 'redis'
import { redisUri } from '../../utils/configUtils';

const redisClient = createClient({
  url: redisUri
})
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});



describe("Testing Redis connection", () => {

  test("should connect to redis ", async () => {

    await redisClient.connect()
    expect(redisClient.isOpen).toBe(true);
    await redisClient.set("key", "value")
    const setValue = await redisClient.get("key");
    expect(setValue).toBe("value");

    // console.log(setValue)

    // Close the connection

    await redisClient.quit();

    // Expect the client to be closed after quit
    expect(redisClient.isOpen).toBe(false);
  })
})
