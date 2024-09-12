FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -v

COPY . .


EXPOSE 3025

# Start the app
CMD ["npm", "start"]

