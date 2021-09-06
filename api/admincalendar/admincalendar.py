from django.contrib import admin


def register_admincalendar(modeladmin, model):
    class Meta:
        proxy = True
        app_label = model._meta.app_label
        verbose_name = model._meta.verbose_name

    attrs = {"__module__": "", "Meta": Meta}

    newmodel = type(f"{model.__name__}Calendar", (model,), attrs)

    admin.site.register(newmodel, modeladmin)
    return modeladmin
