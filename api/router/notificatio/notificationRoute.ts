import express from 'express'
import { notificationController } from '../../controller/notification/notificationController'

export const notificationRouter = express.Router()

notificationRouter.get('/notifications', notificationController)

