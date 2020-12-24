FROM node:12

WORKDIR /usr/src/app
RUN mkdir -p /public
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 9090
CMD [ "node", "server.js" ]