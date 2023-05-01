#!/bin/bash
rm -rf /app/api/static
mkdir -p /app/api/static

python api/manage.py migrate --noinput
python api/manage.py collectstatic --noinput
