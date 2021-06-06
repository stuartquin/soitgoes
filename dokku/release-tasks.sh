#!/bin/bash
rm -rf /storage/build
rm -rf /app/api/static

mkdir -p /storage/build
mkdir -p /app/api/static

python api/manage.py migrate --noinput
python api/manage.py collectstatic --noinput

npm --prefix=ui run build

mv ui/build/static/* /app/api/static
mv ui/build/* /storage/build
