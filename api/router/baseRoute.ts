import express from 'express';
import { authRouter } from './auth/authRouter';
import { followRouter } from './follow/followRouter';
import { notificationRouter } from './notificatio/notificationRoute';

export const baseRouter = express.Router();

// Mount the authRouter on '/auth' path
baseRouter.use('/api/v1', authRouter);
baseRouter.use('/api/v1/me', followRouter)
baseRouter.use('/api/v1/me', notificationRouter)
