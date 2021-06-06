#!/bin/bash

ROOT=/home/dokku
APP=$1
STORAGE=$ROOT/storage/$APP
NGINX=$ROOT/$APP/nginx.conf.d

mkdir -p $STORAGE
mkdir -p $NGINX

dokku apps:create $APP

dokku config:set --no-restart $APP DOKKU_LETSENCRYPT_EMAIL=$2
dokku config:set $APP DATABASE_NAME=/storage/db.sqlite3
dokku config:set $APP DJANGO_SECRET_KEY=$3
dokku storage:mount $APP $STORAGE:/storage
dokku storage:mount $APP $STORAGE/static:/app/api/static
