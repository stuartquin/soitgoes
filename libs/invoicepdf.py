from django.template import loader
import tempfile
import subprocess


def render(invoice, account, project):
    template = loader.get_template('invoice.html')
    temp_name = tempfile.NamedTemporaryFile().name
    html_name = temp_name + '.html'
    output_name = temp_name + '.pdf'

    context = {
        'invoice': invoice,
        'contact': project.contact,
        'company': account.company,
        'timeslips': invoice.timeslip_set.all()
    }

    with open(html_name, 'w') as output:
        output.write(template.render(context))
        output.flush()

    subprocess.call(['wkhtmltopdf', html_name, output_name])
