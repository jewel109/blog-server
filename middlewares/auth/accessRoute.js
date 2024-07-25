const asyncError = require('express-async-handler')
const jwt = require('jsonwebtoken')
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require('../../helpers/auth/tokenHelper')
const User = require('../../model/user')
const CustomError = require('../Error/CustomError')
const { log, chalk } = require('../../controllers/comment/comment')
const { sendStatusError } = require('../../helpers/httpError')
const verifyToken = require('../../helpers/tokenVerify')

const getAccessToRoute = asyncError(async (req, res, next) => {

  try {
    const { JWT_SECRET } = process.env
    // console.log(JWT_SECRET)

    if (!isTokenIncluded(req, res)) {
      log(chalk("no token found"))
      next("no token found")
    }

    const accessToken = getAccessTokenFromHeader(req, res)

    if (accessToken === 'null') {

      return res(res, 404, "accessToken is null")
    } else if (accessToken != 'null') {
      console.log(accessToken)

      const { decoded, tokenError } = verifyToken(accessToken)
      console.log("decoded is ", decoded)
      if (tokenError) {

        console.log(tokenError)
        return sendStatusError(res, 404, tokenError)
      }
      console.log(`decoded jsonwebtoken ${decoded}`)

      const user = await User.findById(decoded.id)
      console.log(`in accessroute ${user}`)
      if (!user) {
        console.log('no user')
        return sendStatusError(res, 404, "no user found")
      }
      // Todo:Blog how refactored
      req.user = user
      next()
    }
  } catch (err) {
    sendStatusError(res, 500, err.message)
  }
})

module.exports = { getAccessToRoute }
