const CustomError = require("../../middlewares/Error/CustomError");
const { sendStatusError } = require("../httpError");

const isTokenIncluded = (req, res) => {

  // console.log(`in isTokenIncluded ${req}`)
  // console.log('in req.headers ' + req.headers.authrization)
  console.log(req.headers)

  if (!req.headers.authorization) {
    //console.log("authorization in header is not found")
    return sendStatusError(res, 404, "authrization in headers is not found")
  } else if (!req.headers.authorization.startsWith("Bearer")
  ) {

    return sendStatusError(res, 404, "no token in authorization")
  }
  return (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))


}

const getAccessTokenFromHeader = (req, res) => {

  const authorization = req.headers.authorization;
  // console.log(`authrization=${authrization}`)
  if (!authorization) {
    return sendStatusError(res, 404, "not valid authorization")
  }
  const accessToken = authorization.split(" ")[1];
  if (accessToken === "null") {
    return sendStatusError(res, 404, "accessToken is null")
  }
  if (!accessToken) {
    return sendStatusError(res, 404, "accessToken is not found")
  }
  console.log(`access token ${accessToken}`)
  return accessToken;
}


const sendToken = (user, statusCode, res) => {

  const token = user.generateJwtFromUser();
  // console.log(user)
  // console.log(token);
  // console.log("in sendtoken token is " + token)
  res.status(statusCode).json({
    success: true,
    token,
  });
};
module.exports = { sendToken, isTokenIncluded, getAccessTokenFromHeader };
