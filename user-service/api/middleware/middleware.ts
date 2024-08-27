import express, { Express } from "express"

import cors from 'cors'
import { unKnownRouteController } from "../controller/unknownRouteController"
import { userRouter } from "../router/userRouter"
import { baseRouter } from "../router/baseRoute"
import mongoose from "mongoose"
import { mongoUrl } from "../../utils/configUtils"

export const setupMiddleware = async (app: Express) => {

  const conn = await mongoose.connect(String(mongoUrl), {
  });
  app.use(express.json())
  app.use(cors())
  app.use(baseRouter)
  app.use("*", unKnownRouteController)
}
