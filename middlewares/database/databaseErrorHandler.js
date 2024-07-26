const ErrorWrapper = require("express-async-handler")
const Story = require("../../model/story")
const CustomError = require("../Error/CustomError")
const { log, chalk } = require("../../controllers/comment/comment")
const { sendStatusError } = require("../../helpers/httpError")

const checkStoryExist = ErrorWrapper(async (req, res, next) => {
  const { slug } = req.params
  if (!slug) {

    return sendStatusError(res, 404, "slug is not given")
  }
  // console.log(slug)
  const story = await Story.findOne({ slug })
  if (!story) {
    // log(chalk.red("not found the story"))
    return sendStatusError(res, 404, "There is no such story with this slug")
  }

  // log(chalk.red(story))

  next()
})

const checkUserAndStoryExist = ErrorWrapper(async (req, res, next) => {
  const { slug } = req.params

  const story = await Story.findOne({
    slug,
    author: req.user
  })

  if (!story) {
    return next(new CustomError("There is no story with this slug ascociated with this user"))
  }

  next()

})

module.exports = {
  checkStoryExist,
  checkUserAndStoryExist
}
