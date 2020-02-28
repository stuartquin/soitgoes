import datetime

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Max

from libs import invoicepdf

INVOICE_DUE_DAYS = 14

TASK_STATUS_OPEN = 'OPEN'
TASK_STATUS_PROGRESS = 'PROGRESS'
TASK_STATUS_DONE = 'DONE'
TASK_STATUS = [
    (TASK_STATUS_OPEN, 'Open'),
    (TASK_STATUS_PROGRESS, 'In Progress'),
    (TASK_STATUS_DONE, 'Complete'),
]

BILLING_TYPE_TIME = 'TIME'
BILLING_TYPE_FIXED = 'FIXED'
BILLING_TYPE_OPTIONS = [
  (BILLING_TYPE_TIME, 'Time'),
  (BILLING_TYPE_FIXED, 'Fixed Cost'),
];


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
    daily_rate = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    hours_per_day = models.IntegerField(default=0)
    currency = models.CharField(max_length=3, default="GBP")
    archived = models.BooleanField(default=False)
    default_task = models.ForeignKey(
        'Task', models.SET_NULL,
        blank=True, null=True, related_name='project_default'
    )

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
    status = models.CharField(default='DRAFT', max_length=128, choices=[
        ('DRAFT', 'DRAFT'),
        ('ISSUED', 'ISSUED'),
        ('PAID', 'PAID')
    ])
    reference = models.CharField(default=None, null=True, blank=True, max_length=256)
    modifier = models.ManyToManyField(InvoiceModifier, blank=True)
    group_by = models.CharField(default='timeslips', max_length=128, choices=[
        ('tasks', 'Task'),
        ('timeslips', 'Timeslip'),
    ])
    show_hours = models.BooleanField(default=True)

    def get_modifier_value(self, value):
        impact = 0
        for mod in self.modifier.all():
            impact += float(value / 100) * mod.percent
        return impact

    @property
    def pdf_name(self):
        account = self.project.account.company.name.replace(' ', '_')
        project = self.project.name.replace(' ', '_')
        return 'Invoice_%s_%s_%s.pdf' % (account, project, self.sequence_num)

    def get_pdf_file(self, user, path=''):
        invoicepdf.render(self, user, path)
        return invoicepdf.get_pdf_file(self, user, path)

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


class Task(models.Model):
    user = models.ForeignKey(User)
    project = models.ForeignKey(Project)
    name = models.CharField(max_length=256)
    cost = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    activity_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    completed_at = models.DateTimeField(default=None, blank=True, null=True)
    due_date = models.DateField(default=None, blank=True, null=True)
    hours_spent = models.FloatField(default=0.0)
    hours_predicted = models.FloatField(default=0.0)
    billing_type = models.CharField(
        max_length=256,
        choices=BILLING_TYPE_OPTIONS,
        default=BILLING_TYPE_TIME,
    )
    state = models.CharField(
        max_length=256,
        choices=TASK_STATUS,
        default=TASK_STATUS_OPEN,
    )
    invoices = models.ManyToManyField(
        Invoice,
        through='TaskInvoice',
        related_name='tasks',
    )

    def __str__(self):
        return self.name

    @property
    def time_billing(self):
        return self.billing_type == BILLING_TYPE_TIME

    @staticmethod
    def set_invoice(tasks, invoice_id):
        """
        Takes a list of tasks and updates with the provided invoice_id
        Also unsets all existing tasks with this invoice_id
        """
        Task.objects.filter(invoice_id=invoice_id).update(invoice_id=None)
        tasks.update(invoice_id=invoice_id)


class TaskInvoice(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    cost = models.DecimalField(max_digits=12, decimal_places=2)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    hours_spent = models.FloatField(default=0.0)


class TimeSlip(models.Model):
    user = models.ForeignKey(User)
    project = models.ForeignKey(Project)
    created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    hours = models.FloatField(default=0.0)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=3, default=0)
    task = models.ForeignKey(Task, blank=True, null=True)
    comment = models.CharField(max_length=512, blank=True, null=True)
    invoice = models.ForeignKey(
        Invoice, models.SET_NULL,
        blank=True, null=True, related_name='timeslips'
    )

    @property
    def cost(self):
        return float(self.hourly_rate) * self.hours

    def save(self, *args, **kwargs):
        if not self.hourly_rate:
            self.hourly_rate = self.project.hourly_rate

        super().save(*args, **kwargs)
        if self.task:
            self.task.activity_at = datetime.datetime.now()
            self.task.save()

    def __str__(self):
        return '[{}] {}'.format(self.project.name, self.date)

    @staticmethod
    def set_invoice(timeslips, invoice_id):
        """
        Takes a list of timeslips_ids and updates with the provided invoice_id
        Also unsets all existing timeslips with this invoice_id
        """
        TimeSlip.objects.filter(invoice_id=invoice_id).update(invoice_id=None)
        timeslips.update(invoice_id=invoice_id)

    class Meta:
        unique_together = ('user', 'task', 'date')



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
