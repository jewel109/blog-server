const express = require("express")
const router = express.Router()
const {register, login, forgetPassword,resetPassword, getPrivateData,} = require('../controllers/auth/auth')
const { getAccessToRoute } = require("../middlewares/auth/accessRoute")

router.post('/register',register)
router.post('/login',login)
router.post('/forgotpassword',forgetPassword,)
// router.get('/resetpassword/:resetPasswordToken')
router.put('/resetpassword', resetPassword)
router.get('/private',getAccessToRoute,getPrivateData)

module.exports = router
