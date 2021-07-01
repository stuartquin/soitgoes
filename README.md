## Developing

```
# Build and start server
docker-compose up

cd ./ui
npm run start
```

## Deployment

- Github action triggers

### Dokku Setup

On your dokku host:

```
# - Setup ENV
# - Mount files from container to make available to nginx running on host.

./dokku/setup.sh <APP_NAME> <ADMIN_EMAIL> <DJANGO_SECRET_KEY>

# ... trigger a release, e.g. github action ...

# Setup letsencrypt
./dooku/post-install.sh <APP_NAME>

```

### Syncthing Backups

Install Syncthing

```
echo "deb https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
curl -s https://syncthing.net/release-key.txt | sudo apt-key add -
sudo apt-get install syncthing

cp /lib/systemd/system/syncthing@.service /etc/systemd/system/syncthing.service
# Edit [Service] to include User=root

systemctl reload syncthing
systemctl start syncthing

# View logs
journalctl -e -u syncthing
```

Update `~/.config/syncthing/config.xml` to include the required device ids, add
devices to the `default` folder
