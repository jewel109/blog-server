import express, { Express } from "express"

import cors from 'cors'
import mongoose from "mongoose"
import { mongoUrl } from "../../utils/configUtils"
import { unKnownRouteController } from "../controller/auth/unknownRouteController"
import { baseRouter } from "../router/baseRoute"

export const setupMiddleware = async (app: Express) => {

  const conn = await mongoose.connect(String(mongoUrl), {
  });
  app.use(express.json())
  app.use(cors())
  app.use(baseRouter)
  app.use("*", unKnownRouteController)
}
