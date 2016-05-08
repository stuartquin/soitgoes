from reportlab.pdfgen import canvas
from reportlab.lib.units import cm

line_height = 13
offset_y = (29 * cm)


def detail_col(timeslip):
    return "%s Hours on %s: %s" % (
        timeslip.hours,
        timeslip.date.strftime("%Y-%m-%d"),
        timeslip.project.name
    )


def price_col(timeslip):
    return str(timeslip.hours * timeslip.project.hourly_rate)


def draw_row(c, index, timeslip):
    y_pos = offset_y - index * line_height
    c.drawString(1 * cm, y_pos, detail_col(timeslip))
    c.drawString(12 * cm, y_pos, price_col(timeslip))


def generate_invoice(invoice):
    timeslips = invoice.timeslip_set.all()
    c = canvas.Canvas('/tmp/test.pdf')
    for i, timeslip in enumerate(timeslips):
        draw_row(c, i, timeslip)

    c.save()


    # c = canvas.Canvas('/tmp/test.pdf')
    # c.drawString(100, 100, 'Hello World')
    # c.showPage()
    # c.save()
