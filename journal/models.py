import datetime

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Max

from libs import invoicepdf

INVOICE_DUE_DAYS = 14


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
    company = models.ForeignKey(Company, default=None)

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
    issued_at = models.DateTimeField(default=None, blank=True, null=True)
    paid_at = models.DateTimeField(default=None, blank=True, null=True)
    due_date = models.DateField(default=None, blank=True, null=True)
    total_paid = models.FloatField(default=None, blank=True, null=True)
    total_due = models.FloatField(default=None, blank=True, null=True)
    subtotal_due = models.FloatField(default=None, blank=True, null=True)

    modifier = models.ManyToManyField(InvoiceModifier, blank=True)

    def set_total_due(self):
        item_total = sum(
            float(item.cost_per_unit) * int(item.qty) for item in self.items.all()
        )
        task_total = sum(
            float(task.cost) for task in self.tasks.all()
        )
        total = (self.total_hours * self.project.hourly_rate)
        total = total + item_total + task_total
        modifier_impact = self.get_modifier_value(total)
        self.subtotal_due = total
        self.total_due = total + modifier_impact

    def save(self, *args, **kwargs):
        pk = self.pk
        if pk is None:
            if self.sequence_num == 0:
                invoices = Invoice.objects.filter(project=self.project)
                max = invoices.aggregate(Max('sequence_num')).get('sequence_num__max')
                self.sequence_num = (max or 0) + 1
            if self.due_date is None:
                self.due_date = (datetime.datetime.now() + datetime.timedelta(
                    days=INVOICE_DUE_DAYS
                )).date()

        super().save(*args, **kwargs)

        if self.issued_at is None:
            TimeSlip.set_invoice(
                TimeSlip.objects.filter(
                    project=self.project,
                    invoice=None
                ),
                self.pk
            )

            Task.set_invoice(
                Task.objects.filter(
                    project=self.project,
                    invoice=None,
                ).exclude(completed_at=None),
                self.pk
            )
        else:
            self.set_total_due()
            super().save(*args, **kwargs)

        invoicepdf.remove_pdf_file(self)

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

    def get_pdf_file(self):
        pdf_file = invoicepdf.get_pdf_file(self)
        if pdf_file is None:
            invoicepdf.render(self)
            return invoicepdf.get_pdf_file(self)
        return pdf_file

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
