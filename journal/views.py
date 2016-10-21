import json

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
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = auth.authenticate(username=username, password=password)

        if user and user.is_active:
            auth.login(request, user)
            return HttpResponseRedirect('/')

        raise PermissionDenied()


def logout_user(request):
    auth.logout(request)
    return HttpResponseRedirect('/')


@csrf_exempt
def monzo_webhook(request):
    if request.method == 'POST':
        content = request.body.decode('utf-8')
        data = json.loads(content)

        if data['type'] == 'transaction.created':
            with open('/tmp/monzo.log', 'a') as log:
                log.write(content.replace('\n', '') + '\n')

            transaction = data['data']
            existing = monzo.get_existing_expense(transaction['id'])
            if not existing:
                expense = monzo.import_transaction(transaction)
                expense.save()

    return HttpResponse('OK')
