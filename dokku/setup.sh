#!/bin/bash

ROOT=/home/dokku
APP=$1
STORAGE=$ROOT/storage/$APP
NGINX=$ROOT/$APP/nginx.conf.d

mkdir -p $STORAGE
mkdir -p $NGINX

dokku apps:create $APP

echo "location /static {" > $NGINX/static.conf
echo "    alias $STORAGE/static;" >> $NGINX/static.conf
echo "}" >> $NGINX/static.conf

dokku config:set $APP DATABASE_NAME=/storage/db.sqlite3
dokku config:set --no-restart $APP DOKKU_LETSENCRYPT_EMAIL=$2
dokku storage:mount $APP $STORAGE:/storage
dokku storage:mount $APP $STORAGE/static:/app/static
