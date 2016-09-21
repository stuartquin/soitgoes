from fabric.api import run
from fabric import operations, context_managers

APP_PATH = '/var/app/soitgoes'


def host_type():
    run('uname -s')


def deploy_js():
    with context_managers.lcd('journal/static/journal/'):
        operations.local('webpack -p')
        operations.local("""
        ./node_modules/node-sass/bin/node-sass scss -r -o dist/css
        """)

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


def deploy():
    deploy_js()

    with context_managers.cd(APP_PATH):
        run('git pull --rebase')

        with context_managers.prefix('source ~/venvs/soitgoes/bin/activate'):
            run('python manage.py collectstatic --no-input -i node_modules')

        run('git rev-parse HEAD > version.txt')
        run('service soitgoes restart')
