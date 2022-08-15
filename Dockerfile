FROM node:latest

WORKDIR /home/node/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

EXPOSE $PORT

# upgrage distribution to use different command line tools
# RUN apt-get update && \ 
#   apt-get -y dist-upgrade

VOLUME [ "/home/node/app" ]

