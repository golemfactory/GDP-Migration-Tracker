FROM node:alpine

WORKDIR /usr/app
COPY main.js /usr/app

RUN npm install discord.js@12.5.3

CMD [ "node", "main.js" ]
