import datetime

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Max

from libs import invoicepdf

INVOICE_DUE_DAYS = 14

TASK_STATUS_OPEN = 'OPEN'
TASK_STATUS_PROGRESS = 'PROGRESS'
TASK_STATUS_DONE = 'DONE'
TASK_STATUS_REJECTED = 'REJECTED'
TASK_STATUS = [
    (TASK_STATUS_OPEN, 'Open'),
    (TASK_STATUS_PROGRESS, 'In Progress'),
    (TASK_STATUS_DONE, 'Complete'),
    (TASK_STATUS_REJECTED, 'Rejected'),
]


class Billing(models.Model):
    bank_name = models.CharField(max_length=512)
    account_no = models.CharField(max_length=512)
    sort_code = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s, %s" % (self.bank_name, self.sort_code)


class Company(models.Model):
    name = models.CharField(max_length=512)
    address1 = models.CharField(max_length=512, blank=True, null=True)
    address2 = models.CharField(max_length=512, blank=True, null=True)
    city = models.CharField(max_length=128, blank=True, null=True)
    post_code = models.CharField(max_length=128, blank=True, null=True)
    reg_number = models.CharField(max_length=128, blank=True, null=True)
    logo_image = models.TextField(blank=True, null=True)
    vat_number = models.CharField(max_length=128, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    billing = models.ForeignKey(
        Billing, models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return "%s, %s" % (self.name, self.city)


class Account(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(User)
    company = models.ForeignKey(
        Company, models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return "%s" % (self.company.name)


class Contact(models.Model):
    name = models.CharField(max_length=512)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    account = models.ForeignKey(Account)

    address1 = models.CharField(max_length=512, blank=True, null=True)
    address2 = models.CharField(max_length=512, blank=True, null=True)
    city = models.CharField(max_length=128, blank=True, null=True)
    post_code = models.CharField(max_length=128, blank=True, null=True)
    vat_number = models.CharField(max_length=128, blank=True, null=True)

    def __str__(self):
        return "%s (%s)" % (self.name, self.email)


class InvoiceModifier(models.Model):
    name = models.CharField(max_length=512)
    percent = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} ({}%)".format(self.name, self.percent)


class Project(models.Model):
    contact = models.ForeignKey(Contact)
    account = models.ForeignKey(Account)
    name = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)
    hourly_rate = models.FloatField(default=0.0)
    hours_per_day = models.IntegerField(default=0)
    currency = models.CharField(max_length=3, default="GBP")
    archived = models.BooleanField(default=False)

    def get_uninvoiced_hours(self, *args, **kwargs):
        timeslips = TimeSlip.objects.filter(project=self, invoice=None)
        return sum([t.hours for t in timeslips])

    def get_total_paid(self, *args, **kwargs):
        invoices = Invoice.objects.filter(
            project=self
        ).exclude(total_paid__isnull=True)
        return sum([i.total_paid for i in invoices])

    def __str__(self):
        return "%s" % (self.name)


class Invoice(models.Model):
    sequence_num = models.IntegerField(default=0)
    project = models.ForeignKey(Project)
    created_at = models.DateTimeField(auto_now_add=True)
    issued_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    paid_at = models.DateTimeField(default=None, blank=True, null=True)
    due_date = models.DateField(default=None, blank=True, null=True)
    total_paid = models.FloatField(default=None, blank=True, null=True)
    total_due = models.FloatField(default=None, blank=True, null=True)
    subtotal_due = models.FloatField(default=None, blank=True, null=True)
    subtotal_due = models.FloatField(default=None, blank=True, null=True)
    status = models.CharField(default='DRAFT', max_length=128, choices=[
        ('DRAFT', 'DRAFT'),
        ('ISSUED', 'ISSUED'),
        ('PAID', 'PAID')
    ])
    reference = models.CharField(default=None, null=True, blank=True, max_length=256)
    modifier = models.ManyToManyField(InvoiceModifier, blank=True)

    def get_modifier_value(self, value):
        impact = 0
        for mod in self.modifier.all():
            impact += (value / 100) * mod.percent
        return impact

    @property
    def pdf_name(self):
        account = self.project.account.company.name.replace(' ', '_')
        project = self.project.name.replace(' ', '_')
        return 'Invoice_%s_%s_%s.pdf' % (account, project, self.sequence_num)

    @property
    def total_hours(self):
        return sum([t.hours for t in self.timeslips.all()])

    def get_pdf_file(self, user, path=''):
        pdf_file = invoicepdf.get_pdf_file(self, user, path)
        if pdf_file is None:
            invoicepdf.render(self, user, path)
            return invoicepdf.get_pdf_file(self, user, path)
        return pdf_file

    @staticmethod
    def get_bulk_file(invoices, user):
        return invoicepdf.get_bulk_file(invoices, user)

    @staticmethod
    def get_next_sequence_num(project_id):
        agg = Invoice.objects.filter(project=project_id).aggregate(
            Max('sequence_num')
        )
        current = agg.get('sequence_num__max', 0)
        return current + 1 if current else 1

    def __str__(self):
        return "[%s] %s" % (self.sequence_num, self.project.name)


class InvoiceItem(models.Model):
    name = models.CharField(max_length=128)
    units = models.CharField(max_length=128)
    qty = models.IntegerField(default=0)
    cost_per_unit = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    invoice = models.ForeignKey(Invoice, related_name='items')

    def __str__(self):
        return self.name


class Task(models.Model):
    user = models.ForeignKey(User)
    project = models.ForeignKey(Project)
    name = models.CharField(max_length=256)
    cost = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(default=None, blank=True, null=True)
    due_date = models.DateField(default=None, blank=True, null=True)
    hours_spent = models.FloatField(default=0.0)
    hours_predicted = models.FloatField(default=0.0)
    state = models.CharField(
        max_length=256,
        choices=TASK_STATUS,
        default=TASK_STATUS_OPEN,
    )

    invoice = models.ForeignKey(
        Invoice, models.SET_NULL,
        blank=True, null=True, related_name='tasks'
    )

    def __str__(self):
        return self.name

    @staticmethod
    def set_invoice(tasks, invoice_id):
        """
        Takes a list of tasks and updates with the provided invoice_id
        Also unsets all existing tasks with this invoice_id
        """
        Task.objects.filter(invoice_id=invoice_id).update(invoice_id=None)
        tasks.update(invoice_id=invoice_id)


class TaskNote(models.Model):
    user = models.ForeignKey(User)
    task = models.ForeignKey(Task, related_name='notes')
    content = models.TextField(blank=True, null=True)
    content_type = models.CharField(
        choices=(
            ('TEXT', 'Text'),
        ),
        max_length=4,
        default='TEXT'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:100] + '...'


class TimeSlip(models.Model):
    user = models.ForeignKey(User)
    project = models.ForeignKey(Project)
    created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    hours = models.FloatField(default=0.0)

    comment = models.CharField(max_length=512, blank=True, null=True)
    invoice = models.ForeignKey(
        Invoice, models.SET_NULL,
        blank=True, null=True, related_name='timeslips'
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return "[%s] %s" % (self.project.name, self.comment)

    @staticmethod
    def set_invoice(timeslips, invoice_id):
        """
        Takes a list of timeslips_ids and updates with the provided invoice_id
        Also unsets all existing timeslips with this invoice_id
        """
        TimeSlip.objects.filter(invoice_id=invoice_id).update(invoice_id=None)
        timeslips.update(invoice_id=invoice_id)

    class Meta:
        unique_together = ('user', 'project', 'date')


class Activity(models.Model):
    """ Activity feed of some sort """
    user = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    item_id = models.IntegerField()
    status = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(
        choices=(
            ('TIM', 'TimeSlip'),
            ('INV', 'Invoice'),
            ('PRO', 'Project')
        ),
        max_length=3
    )
    action = models.CharField(
        choices=(
            ('CRE', 'Create'),
            ('UPD', 'Update'),
            ('DEL', 'Delete')
        ),
        max_length=3
    )

    @staticmethod
    def _insert(user, id, type, action, status=None):
        activity = Activity()
        activity.user = user
        activity.item_id = id
        activity.type = type
        activity.action = action
        activity.status = status
        activity.save()

    @staticmethod
    def create(user, id, type):
        Activity._insert(user, id, type, 'CRE')

    @staticmethod
    def update(user, id, type, status=None):
        Activity._insert(user, id, type, 'UPD', status)


class Expense(models.Model):
    user = models.ForeignKey(User)
    date = models.DateField()
    value = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(default=None, blank=True, null=True)
    monzo_id = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    reference = models.CharField(max_length=512, blank=True, null=True)
    notes = models.CharField(max_length=1024, blank=True, null=True)
    project = models.ForeignKey(
        Project,
        models.SET_NULL,
        blank=True,
        null=True
    )
