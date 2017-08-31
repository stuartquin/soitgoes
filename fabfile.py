from fabric.api import run
from fabric import operations, context_managers

APP_PATH = '/var/app/soitgoes'

def letsencrypt():
    cmd = '/opt/letsencrypt/letsencrypt-auto'
    params = 'certonly -a webroot --webroot-path=/usr/share/nginx/html -d books.stuartquin.com'

    run('%s %s' % (cmd, params))

def deploy_js():
    # with context_managers.lcd('journal/static/journal/'):
    #     operations.local('webpack -p')
    #     operations.local("""
    #     ./node_modules/node-sass/bin/node-sass scss -r -o dist/
    #     """)
    docker = 'docker exec soitgoes_nodejs_1'
    operations.local(
        '%s ./node_modules/webpack/bin/webpack.js -p' % docker
    )

# ./node_modules/webpack/bin/webpack.js --optimize-minimize --define process.env.NODE_ENV="'production'"
    # operations.local(
    #     '%s ./node_modules/node-sass/bin/node-sass scss -r -o dist' % docker
    # )

    operations.put(
        'journal/static/journal/dist/bundle.js',
        '/var/app/soitgoes/journal/static/journal/dist/bundle.js'
    )
    operations.put(
        'journal/static/journal/dist/main.css',
        '/var/app/soitgoes/journal/static/journal/dist/main.css'
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


def deploy(branch='master'):
    deploy_js()

    with context_managers.cd(APP_PATH):
        run('git fetch')
        run('git checkout %s' % branch)
        run('git pull --rebase')

        with context_managers.prefix('source ~/venvs/soitgoes/bin/activate'):
            run('python manage.py collectstatic --no-input -i node_modules')
            run('python manage.py showmigrations')

        run('git rev-parse HEAD > version.txt')
        run('service soitgoes restart')
