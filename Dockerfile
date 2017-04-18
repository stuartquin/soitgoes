FROM python:3.5

RUN mkdir /app
ADD requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

ADD fabfile.py /app/fabfile.py
ADD manage.py /app/manage.py
ADD journal /app/journal
ADD soitgoes /app/soitgoes
ADD libs /app/libs
ADD assets /app/assets
ADD version.txt /app/version.txt


WORKDIR /app
