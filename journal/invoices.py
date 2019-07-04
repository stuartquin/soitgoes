from journal.models import Task, Invoice, TaskInvoice, TimeSlip

def _save_invoice_timeslip(invoice, item):
    timeslip = TimeSlip.objects.get(pk=item.get('id'))
    timeslip.invoice = invoice
    timeslip.save()


def _save_invoice_task(invoice, item):
    task_invoice = TaskInvoice.objects.create(
        task=Task.objects.get(pk=item.get('id')),
        invoice=invoice,
        cost=item.get('subTotal')
    )
    task_invoice.save()

    for sub_item in item.get('subItems', []):
        _save_invoice_timeslip(invoice, sub_item)



def save_invoice_items(invoice, items):
    for item in items:
        item_type = item.get('itemType')

        if item_type == 'tasks':
            _save_invoice_task(invoice, item)

        if item_type == 'timeslips':
            _save_invoice_timeslip(invoice, item)

    invoice.save()
