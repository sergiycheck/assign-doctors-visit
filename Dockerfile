FROM node:latest

WORKDIR /home/node/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

EXPOSE $PORT

RUN apt-get update && \ 
  apt-get -y dist-upgrade

VOLUME [ "/home/node/app" ]

CMD yanr run build
