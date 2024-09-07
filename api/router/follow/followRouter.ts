import express from 'express'
import { resourceAccessController } from '../../controller/auth/authController'
import { followingController } from '../../controller/follow/followController'

export const followRouter = express.Router()

followRouter.use(resourceAccessController)

followRouter.post('/follow', followingController)
