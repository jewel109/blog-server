import express from 'express';
import { userRouter } from './userRouter';

export const baseRouter = express.Router();

// Mount the authRouter on '/auth' path
baseRouter.use('/api/v1', userRouter);
