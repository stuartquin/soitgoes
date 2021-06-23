from rest_framework.permissions import BasePermission
from journal import models


class HasProjectAccess(BasePermission):
    def has_permission(self, request, view):
        project_id = request.parser_context["kwargs"]["pk"]
        project = models.Project.objects.filter(id=project_id).first()
        return len(project.account.users.filter(id=request.user.id)) > 0


class HasBulkInvoiceAccess(BasePermission):
    def has_permission(self, request, view):
        return True


class HasInvoiceAccess(BasePermission):
    def has_permission(self, request, view):
        invoice_id = request.query_params.get("invoice", None) or request.data.get(
            "invoice", None
        )

        if invoice_id is None:
            invoice_id = request.parser_context["kwargs"]["pk"]

        invoice = models.Invoice.objects.get(id=invoice_id)
        project = models.Project.objects.filter(id=invoice.project_id).first()
        return len(project.account.users.filter(id=request.user.id)) > 0


class HasTimeslipAccess(BasePermission):
    def has_permission(self, request, view):
        # @TODO this needs fixed
        if request.method == "GET":
            return True

        if "project" in request.data:
            project_ids = set([request.data["project"]])
        else:
            project_ids = set([data["project"] for data in request.data])

        projects = models.Project.objects.filter(id__in=project_ids)
        # list flatten
        users = set([u.id for p in projects for u in p.account.users.all()])
        return request.user.id in users


class HasTaskAccess(BasePermission):
    def has_object_permission(self, request, view, task: models.Task):
        return models.Project.objects.filter(
            account__in=request.user.account_set.all()
        ).exists()
