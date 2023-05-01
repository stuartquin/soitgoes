FROM python:3.9

WORKDIR /app

ADD install /app/install
RUN tar -xf /app/install/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz
RUN ln -s /app/wkhtmltox/bin/wkhtmltopdf /usr/bin/wkhtmltopdf

ADD api/requirements.txt /app/api/requirements.txt
RUN pip install -r /app/api/requirements.txt

ADD ui/package.json /app/ui/package.json
ADD ui/package-lock.json /app/ui/package-lock.json

# TODO ideally should only do this on dev...
# could uninstall it in the Jenkinsfile?
RUN pip install ipdb

ADD Procfile /app/Procfile
ADD api/manage.py /app/api/manage.py
ADD api/journal /app/api/journal
ADD api/users /app/api/users
ADD api/crm /app/api/crm
ADD api/soitgoes /app/api/soitgoes
ADD api/libs /app/api/libs
ADD api/assets /app/api/assets
ADD ui/ /app/ui

ADD dokku/nginx.conf.sigil /app/nginx.conf.sigil
ADD dokku/release-tasks.sh /app/release-tasks.sh
