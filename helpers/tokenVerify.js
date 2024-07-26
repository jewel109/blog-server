const { JWT_SECRET } = process.env
const jwt = require("jsonwebtoken")
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { decoded: decoded, tokenError: null }
  } catch (error) {
    console.log(error)
    return { decoded: null, tokenError: error }
  }
}


module.exports = verifyToken
