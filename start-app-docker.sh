#!/bin/sh

yarn install
yarn run build

docker compose -f docker-compose.full.yml up --build
