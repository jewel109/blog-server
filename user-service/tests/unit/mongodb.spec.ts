
import mongoose from 'mongoose';
import { mongoUrl } from '../../utils/configUtils';

beforeAll(async () => {

});


describe("Connection of mongodb", () => {

  test("should connected to mongodb ", async () => {

    const conn = await mongoose.connect(String(mongoUrl), {
    });

    console.log()

    expect(conn).not.toBe(null)
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected in Mongoose

    // You can also check if the connection object has specific properties
    expect(conn.connection.name).toBe('test'); // Ensures it's connected to the correct database
    expect(conn.connection.host).toBe('localhost'); // Ensures it's connected to the correct host

    // Clean up after the test
    await mongoose.disconnect()

  })
})
