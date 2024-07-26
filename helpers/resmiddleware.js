// captureResponseBody.js
const captureResponseBody = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    res.locals.body = body;
    return originalSend.apply(res, arguments);
  };

  next();
};

module.exports = captureResponseBody;

