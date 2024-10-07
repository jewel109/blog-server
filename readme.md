# Blog API Uses

- allows users to following each other after getting authorized
- allows users to creating blog posts
- allows users to access real-time news feed
- allows users to receive instant notifications
- used event driven architecture
- End to End test to all the api

# Installation

Docker-compose is used for installing mongodb, elastic search, redis, kafka

you can build and run the container after cloning the repo by following command

```shell
docker compose up --build
```

you can install the dependencies of the api by running

```shell
pnpm install # pnpm must be in your path if not use npm 

```

You have to need a **env** file to run the server and you have to keep the env file in `config` directory.

just copy the `.env.example` to `.config/test.env`

Then run

```shell
pnpm start
```

Finally go to other terminal and run

```shell
pnpm run consume # kafka consumer will subscripe to topics and handle the messages
```

Now the api server is ready

For Test you can run

```shell
npm test
```

## Technology used

kafkajs,nodejs redis client, nodejs elastic search client , mongoose, expressjs, typescript, jsonwebtoken

## Api end points are bellow

**For Register**
`POST http://localhost:3025/api/v1/register`
request body

```json
{
  "name": "jewel", "email": "jewel@gmail.com", "password": "1253"
}
```

**For Login**
`POST http://localhost:3025/api/v1/login`
request body

```json
{
   "email": "jewel@gmail.com", "password": "1253"
}
```

**For following a User**
`POST http://localhost:3025/api/v1/me/follow`
request body

```json
{
   "followeeEmail": "jewel@gmail.com", 
}
```

Request Header

```shell
Authorization: bearer token
```

#### why mongodb

#### why redis

#### why kafka
