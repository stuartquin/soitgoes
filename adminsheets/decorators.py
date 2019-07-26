from adminsheets.sites import admin_sheets


def register_sheet(*models):
    from django.contrib.admin import ModelAdmin
    from django.contrib.admin.sites import site as admin_site

    def _model_admin_wrapper(admin_class):
        if not models:
            raise ValueError('At least one model must be passed to register.')

        if not issubclass(admin_class, ModelAdmin):
            raise ValueError('Wrapped class must subclass ModelAdmin.')

        # TODO using a private thing here, not good!
        for model in models:
            admin_sheets.register(model, admin_site._registry.get(model))

        return admin_class
    return _model_admin_wrapper
