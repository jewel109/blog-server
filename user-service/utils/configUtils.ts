import path from 'path';
import dotenv from 'dotenv';

export function loadEnvVariables(envFilePath: string): { [key: string]: string | undefined } {
  // Load environment variables from the specified file
  dotenv.config({ path: path.resolve(__dirname, envFilePath), debug: true });

  // Return all loaded environment variables
  return process.env;
}





const { DB_USER_NAME, JWT_SECRET, DB_NAME, DB_USER_PASS, PORT, URI, REDIS_URI, ELASTIC_URI, MONGO_URI } = loadEnvVariables("../config/test.env")

export const dbUserName = DB_USER_NAME
export const dbName = DB_NAME
export const dbPass = DB_USER_PASS
export const port = PORT
export const url = String(URI)
export const jwtSecret = String(JWT_SECRET)
export const redisUri = REDIS_URI
export const elasticSearchUri = ELASTIC_URI
export const mongoUrl = MONGO_URI

