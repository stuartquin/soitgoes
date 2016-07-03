from django.template import loader
import tempfile
import subprocess
import os

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


def render(invoice):
    template = loader.get_template('invoice.html')
    temp_name = tempfile.NamedTemporaryFile().name
    html_name = temp_name + '.html'
    output_name = INVOICE_DIR + invoice.pdf_name

    context = {
        'invoice': invoice,
        'contact': invoice.project.contact,
        'company': invoice.project.account.company,
        'items': [],
        'timeslips': invoice.timeslips.all()
    }

    with open(html_name, 'w') as output:
        output.write(template.render(context))
        output.flush()

    subprocess.call(['wkhtmltopdf', html_name, output_name])
