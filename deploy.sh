#!/bin/bash
docker-compose run nodejs npm run build
scp client/dist/bundle.js $1:/home/dokku/storage/$2/static
