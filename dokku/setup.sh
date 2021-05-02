#!/bin/bash

ROOT=/home/dokku
APP=soitgoes
STORAGE=$ROOT/storage/$APP
NGINX=$ROOT/$APP/nginx.conf.d

su dokku
mkdir -p $STORAGE

dokku apps:create $APP

echo "location /static {" > $NGINX/static.conf
echo "    alias $STORAGE/static;" >> $NGINX/static.conf
echo "}" >> $NGINX/static.conf

dokku config:set $APP DATABASE_NAME=/storage/db.sqlite3
dokku storage:mount $APP $STORAGE:/storage
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku letsencrypt:enable $APP
