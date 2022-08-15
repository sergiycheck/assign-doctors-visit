#!/bin/sh

exec docker compose  -f docker-compose.full.yml up --build
