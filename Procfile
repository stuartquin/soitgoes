web: gunicorn --chdir /app/api soitgoes.wsgi:application
release: python api/manage.py migrate --noinput
