from journal.models import InvoiceItem

# %, should be somewhere else
vat_rate = 20


def create_vat_item(amount, invoice):
    vat_amount = (amount / 100.0) * vat_rate

    item = InvoiceItem(
        name='VAT Added at %d%%' % vat_rate,
        units='-',
        qty=1,
        cost_per_unit=vat_amount,
        invoice=invoice
    )
    item.save()

    return item
