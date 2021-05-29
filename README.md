# Install

Requires http://wkhtmltopdf.org/downloads.html

```
sudo apt-get install xfonts-75dpi
```

## Developing

Run the backend:

```
DEV=true python manage.py runserver
```

Setup JS watching:

```
cd journal/static/journal
webpack --progress --watch

# Optional file watcher notification
# Requires libnotify stuff: apt-get install inotify-tools libnotify-bin
inotifywait -m -e modify dist/ | while read -r filename event;  do notify-send "Assets Compiled" -t 500; done
```

## LetsEncrypt renew

```
./letsencrypt-auto certonly --renew-by-default --email <EMAIL> -a manual -d <DOMAIN>
```
