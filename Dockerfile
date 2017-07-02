FROM python:3.5

RUN apt-get update
RUN apt-get install -y zip unzip

WORKDIR /app

ADD install /app/install
RUN tar -xf /app/install/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz
RUN ln -s /app/wkhtmltox/bin/wkhtmltopdf /usr/bin/wkhtmltopdf

ADD requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

# TODO ideally should only do this on dev...
# could uninstall it in the Jenkinsfile?
RUN pip install ipdb

ADD fabfile.py /app/fabfile.py
ADD manage.py /app/manage.py
ADD journal /app/journal
ADD soitgoes /app/soitgoes
ADD libs /app/libs
ADD assets /app/assets
ADD version.txt /app/version.txt
