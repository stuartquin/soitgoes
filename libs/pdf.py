from reportlab.pdfgen import canvas


def generate_invoice(invoice, timeslips):
    c = canvas.Canvas('/tmp/test.pdf')
    c.drawString(100, 100, 'Hello World')
    c.showPage()
    c.save()
