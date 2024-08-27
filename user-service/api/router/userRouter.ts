import express from 'express'
import { sendResponse } from '../../utils/controllerUtils'
import { registerController } from '../controller/authController'

export const userRouter = express.Router()


userRouter.post('/register', registerController)
