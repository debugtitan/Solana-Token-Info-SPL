FROM node:latest

WORKDIR /telebot

COPY . .

RUN npm install

CMD [ "npm", "run", "start" ]
