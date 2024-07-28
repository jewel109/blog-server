const express = require("express")
const dotenv = require('dotenv')
const { connectingDB, connectToampqplib } = require("./helpers/db")
const indexRoute = require('./routes/index')
const cors = require("cors")
const app = express()
const logger = require('./helpers/logger/logger')
const morgan = require("morgan")
const captureResponseBody = require("./helpers/resmiddleware")

//logger('we are in ', 'index.js')

dotenv.config({
  path: ".env"
})
console.log(process.env.PORT, process.env.TESTING_URL, process.env.JWT_SECRET)


app.use(cors({
  "Access-Control-Allow-Origin": "*"
}))
connectingDB()
connectToampqplib()
app.use(express.json())


app.use(captureResponseBody);
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.res(req, res, 'body'),
    JSON.stringify(res.locals.body)
  ].join(' ')
})

)
app.use('/', indexRoute)

app.use('*', function (req, res) {
  res.status(404).json({
    message: "The route is missing"
  });
});
app.use((err, req, res, next) => {
  console.error(`in index.js ${err.stack}`)
  next(err)
})




const port = 9000 || 8000
app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

module.exports = app 
