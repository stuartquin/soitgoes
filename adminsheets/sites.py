class AdminSheetsSite():
    registry = {}

    def register(self, model_class, model_admin):
        path = '{}/{}/'.format(
            model_class._meta.app_label,
            model_class._meta.model_name
        )
        self.registry[path] = (model_class, model_admin)

admin_sheets = AdminSheetsSite()
