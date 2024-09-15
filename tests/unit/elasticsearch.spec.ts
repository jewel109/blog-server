import { Client } from "@elastic/elasticsearch"
import { elasticSearchUri } from "../../utils/configUtils"


console.log("node env ", process.env.NODE_ENV)

describe("Testing Elastic search db connection", () => {


  console.log(elasticSearchUri)

  test("should connect to elastic db", async () => {

    try {
      const client = new Client({ node: elasticSearchUri })

      expect(client).toBeDefined();
      const health = await client.cluster.health();
      expect(health).toHaveProperty('status');


      const indexExists = await client.indices.exists({ index: 'test-index' });
      console.log(indexExists)
    } catch (error) {
      console.log(error)
    }
  })
})
