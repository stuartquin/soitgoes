import json
import sys

from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib import auth
from django.core.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt


def landing(request):
    template = loader.get_template('index.html')
    user = request.user
    context = {
        'is_authenticated': user.is_authenticated() and user.is_active
    }
    return HttpResponse(template.render(context, request))


def logout_user(request):
    auth.logout(request)
    return HttpResponse()
