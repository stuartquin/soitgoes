from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib import auth
from django.core.exceptions import PermissionDenied


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


def auth_monzo(request):
    import ipdb; ipdb.set_trace()
    return HttpResponseRedirect('/')
