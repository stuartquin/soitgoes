from django.template import loader
import tempfile
import subprocess
import os

INVOICE_DIR = '/tmp/'

def get_pdf_file(invoice):
    """
    Returns full path and name of PDF if it exists, otherwise None
    """
    file_name = INVOICE_DIR + invoice.pdf_name
    if os.path.isfile(file_name):
        return open(file_name, 'rb')
    else:
        return None


def remove_pdf_file(invoice):
    """
    Removes the file, should be called on update
    """
    file_name = INVOICE_DIR + invoice.pdf_name
    if os.path.isfile(file_name):
        os.remove(file_name)


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
    contact = project.contact

    modifiers = get_invoice_modifiers(
        invoice.modifier.all(),
        invoice.subtotal_due
    )

    if invoice.due_date:
        due_date = invoice.due_date.strftime('%d %B %Y')
    else:
        due_date = None

    context = {
        'invoice': invoice,
        'contact': contact,
        'project': project,
        'company': project.account.company,
        'timeslips': timeslips,
        'items': invoice.items.all(),
        'modifiers': modifiers,
        'sent_date': invoice.issued_at.strftime('%d %B %Y'),
        'due_date': due_date,
        'tasks': invoice.tasks.all()
    }

    with open(html_name, 'w') as output:
        output.write(template.render(context))
        output.flush()

    subprocess.call(['wkhtmltopdf', html_name, output_name])
