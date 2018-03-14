from django.template import loader
import tempfile
import subprocess
import os
import shutil

INVOICE_DIR = '/tmp'

CURRENCY_LOOKUP = {
    'GBP': '&pound;',
    'USD': '$',
}

def get_pdf_file(invoice, user, path=''):
    """
    Returns full path and name of PDF if it exists, otherwise None
    """
    tmp_dir = get_tmp_dir('%s/%s/%s' % (INVOICE_DIR, user.id, path))
    file_name = tmp_dir + invoice.pdf_name
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


def get_tmp_dir(tmp_path):
    directory = os.path.dirname(tmp_path)

    try:
        os.makedirs(directory)
    except:
        pass

    return tmp_path


def get_bulk_file(invoices, user):
    bulk_dir = get_tmp_dir('%s/%s/bulk/' % (INVOICE_DIR, user.id))
    zip_file = '%sbulk' % get_tmp_dir('%s/%s/' % (INVOICE_DIR, user.id))
    pdfs = [invoice.get_pdf_file(user, 'bulk/') for invoice in invoices]

    try:
        os.remove(zip_file + '.zip')
    except OSError:
        pass

    shutil.make_archive(zip_file, 'zip', bulk_dir)
    return zip_file + '.zip'


def render(invoice, user, path=''):
    template = loader.get_template('invoice.html')
    temp_name = tempfile.NamedTemporaryFile(delete=False).name
    html_name = temp_name + '.html'
    tmp_dir = get_tmp_dir('%s/%s/%s' % (INVOICE_DIR, user.id, path))
    output_name = tmp_dir + invoice.pdf_name
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

    print(project.currency, CURRENCY_LOOKUP.get(project.currency))

    context = {
        'invoice': invoice,
        'contact': contact,
        'project': project,
        'currency': CURRENCY_LOOKUP.get(project.currency),
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
