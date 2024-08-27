import express from 'express'
import { port } from '../utils/configUtils'
import { setupMiddleware } from './middleware/middleware'

const app = express()

app.use("/to", (req, res) => {
  console.log('/to')
  res.send("good")
})
setupMiddleware(app)

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
