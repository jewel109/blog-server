
const express = require("express")
const router = express.Router()



const authRoute = require('./auth')
const userRoute = require('./userRoute')
const storyRoute = require('./storyRoute')
const commentRoute = require('./commentRoute')

router.use("/auth", authRoute)
router.use('/user', userRoute)
router.use('/story', storyRoute)
router.use('/comment', commentRoute)

module.exports = router
