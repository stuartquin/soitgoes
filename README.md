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
