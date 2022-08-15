#!/bin/sh

# start
exec docker compose -f docker-compose.full.yml up --build

# remove
# exec docker compose -f docker-compose.full.yml down --volumes
