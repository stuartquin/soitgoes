import json
import sys

from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib import auth
from django.core.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt

from libs import monzo


def landing(request):
    template = loader.get_template('index.html')
    user = request.user
    context = {
        'is_authenticated': user.is_authenticated() and user.is_active
    }
    return HttpResponse(template.render(context, request))


def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.read().decode('utf-8'))
        username = data.get('username', None)
        password = data.get('password', None)
        user = auth.authenticate(username=username, password=password)

        if user and user.is_active:
            auth.login(request, user)
            return HttpResponse()

        raise PermissionDenied()


def logout_user(request):
    auth.logout(request)
    return HttpResponse()


@csrf_exempt
def monzo_webhook(request):
    if request.method == 'POST':
        raw = request.read()

        try:
            data = json.loads(raw.decode())
        except:
            print(sys.exc_info())
            return HttpResponse('ERROR', status=500)

        if data['type'] == 'transaction.created':
            with open('/tmp/monzo.log', 'a') as log:
                log.write(json.dumps(data) + '\n')

            transaction = data['data']
            existing = monzo.get_existing_expense(transaction['id'])
            if not existing:
                expense = monzo.import_transaction(transaction)
                if expense:
                    expense.save()

    return HttpResponse('OK')
