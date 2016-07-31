from django.template import loader
import tempfile
import subprocess
import os
import datetime

INVOICE_DIR = '/tmp/invoices/'


def get_pdf_file(invoice):
    """
    Returns full path and name of PDF if it exists, otherwise None
    """
    file_name = INVOICE_DIR + invoice.pdf_name
    if os.path.isfile(file_name):
        return open(file_name, 'rb')
    else:
        return None


def get_invoice_modifiers(modifiers, value):
    for mod in modifiers:
        mod.impact = (value / 100) * mod.percent
    return modifiers


def render(invoice):
    template = loader.get_template('invoice.html')
    temp_name = tempfile.NamedTemporaryFile(delete=False).name
    html_name = temp_name + '.html'
    output_name = INVOICE_DIR + invoice.pdf_name
    timeslips = invoice.timeslips.order_by('date').all()
    project = invoice.project
    timeslip_total = invoice.total_hours * project.hourly_rate

    modifiers = get_invoice_modifiers(
        project.invoice_modifier.all(),
        timeslip_total
    )

    total = timeslip_total
    for mod in modifiers:
        total += mod.impact

    context = {
        'invoice': invoice,
        'contact': project.contact,
        'project': project,
        'company': project.account.company,
        'items': [],
        'timeslips': timeslips,
        'modifiers': modifiers,
        'sent_date': datetime.datetime.now().strftime('%d %B %Y'),
        'total': total
    }

    with open(html_name, 'w') as output:
        output.write(template.render(context))
        output.flush()

    subprocess.call(['wkhtmltopdf', html_name, output_name])
