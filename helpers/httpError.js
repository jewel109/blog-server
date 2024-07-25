
const sendStatus = (res, statusCode, message) => {

  res.status(statusCode).json(message)

}
const sendStatusError = (res, statusCode, message) => {

  res.status(statusCode).json({
    success: false,
    message: message
  })

}

module.exports = { sendStatus, sendStatusError }
