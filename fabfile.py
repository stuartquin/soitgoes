from fabric.api import run, env
from fabric.decorators import hosts
from fabric import operations, context_managers

APP_PATH = '/var/app/soitgoes'
HOST_NAME = 'tracking.stuartquin.com'

def letsencrypt():
    run('certbot --nginx -d {}'.format(HOST_NAME))

def deploy_client():
    operations.local('docker exec -it soitgoes_nodejs_1 npm run build')
    operations.put(
        'client/dist/bundle.js',
        '{}/client/dist/bundle.js'.format(APP_PATH)
    )

def migrate():
    with context_managers.cd(APP_PATH):
        run('cp db.sqlite3 ~/backups/db_`date +%Y-%m-%d.%H:%M:%S`.sqlite3')

        with context_managers.prefix('source ~/venvs/soitgoes/bin/activate'):
            run('python manage.py migrate --no-input')
        run('service soitgoes restart')


def install():
    with context_managers.cd(APP_PATH):
        run('git pull --rebase')

        with context_managers.prefix('source ~/venvs/soitgoes/bin/activate'):
            run('pip install -r requirements.txt')

        run('service soitgoes restart')


def status():
    run('service soitgoes status')


def deploy_server(branch):
    with context_managers.cd(APP_PATH):
        run('git fetch')
        run('git checkout %s' % branch)
        run('git pull --rebase')
        run('docker restart soitgoes-web')


@hosts('root@{}'.format(HOST_NAME))
def docker():
    with context_managers.cd(APP_PATH):
        run('docker stop soitgoes-web')
        run('docker rm soitgoes-web')
        cmd = ' '.join([
            'docker run -d',
            '-e DEV=true -p 8889:8889',
            '-v {}/journal:/app/journal'.format(APP_PATH),
            '-v {}/soitgoes:/app/soitgoes'.format(APP_PATH),
            '-v {}/libs:/app/libs'.format(APP_PATH),
            '-v {}/assets:/app/assets'.format(APP_PATH),
            '-v {}/client/dist:/app/journal/static/journal/dist'.format(APP_PATH),
            '-v {}/db.sqlite3:/app/db.sqlite3'.format(APP_PATH),
            '--name soitgoes-web soitgoes-web',
            'python manage.py runserver 0.0.0.0:8889'
        ])
        run(cmd)


@hosts('root@{}'.format(HOST_NAME))
def deploy(app='all', branch='master'):
    if app=='all':
        deploy_server(branch)
        deploy_client()

    if app == 'server':
        deploy_server(branch)

    if app == 'client':
        deploy_client()
