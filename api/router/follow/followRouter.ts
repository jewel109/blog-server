import express from 'express'
import { authenticatedUserController, resourceAccessController } from '../../controller/auth/authController'
import { followingController } from '../../controller/follow/followController'

export const followRouter = express.Router()

followRouter.use(resourceAccessController, authenticatedUserController)

followRouter.post('/follow', followingController)
