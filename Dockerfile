FROM node:18-alpine 

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install -g nodemon@3.1.4

RUN npm install  

COPY . .


EXPOSE 3025


# Start the app
CMD ["npm", "start"]

