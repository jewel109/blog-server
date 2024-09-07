import express from 'express'
import { getResource, loginRouterHandler, registerController, resourceAccessController } from '../../controller/auth/authController'

export const authRouter = express.Router()


authRouter.post('/register', registerController)
authRouter.post('/login', loginRouterHandler)
authRouter.post('/private', resourceAccessController, getResource)
