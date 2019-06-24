import moment from 'moment';

export const getTotal = (invoices, status = null) => {
  const filterFn = status ? (inv) => inv.status === status : (inv) => true;

  return invoices.filter(filterFn).reduce(
    (total, inv) => total + inv.total_due, 0
  );
};

export const getOverdue = (invoices) => {
  const today = (new Date()).toISOString().slice(0, 10);

  return invoices.filter(inv => (
    inv.status === 'ISSUED' &&
    today > inv.due_date
  ));
};

export const getInvoiceStatus = (invoice) => {
  if (!invoice.issued_at) {
    return 'DRAFT';
  }

  if (invoice.paid_at) {
    return 'PAID';
  }

  const now = moment();
  const dueDate = moment(invoice.due_date, 'YYYY-MM-DD');
  if (dueDate.isAfter(now)) {
    return 'ISSUED';
  }

  if (dueDate.isBefore(now)) {
    return 'OVERDUE';
  }

  return 'Unknown';
};

export const getInvoiceDueMessage = (invoice) => {
  if (!invoice.issued_at) {
    return 'Draft';
  }

  if (invoice.paid_at) {
    return `Paid ${moment(invoice.paid_at).format('YYYY-MM-DD')}`;
  }

  const now = moment();
  const dueDate = moment(invoice.due_date, 'YYYY-MM-DD');

  return `Due ${dueDate.fromNow()}`;
};

export const groupByTask = (
  tasks, timeslips, rate, showHours, onRemove
) => {
  const items = Object.values(tasks).sort((a, b) => {
    return a.completed_at > b.completed_at ? 1 : -1;
  });

  return items.map((task) => {
    const hours = timeslips.reduce((agg, timeslip) => (
      agg + (timeslip.task === task.id ? timeslip.hours : 0)
    ), 0);

    return {
      title: task.name,
      subTitle: showHours ? `${hours} hours` : null,
      unitPrice: hours * rate,
      subTotal: hours * rate,
      id: task.id,
      onRemove
    };
  }).filter(task => task.subTotal > 0);
};

export const groupByTimeslip = (
  timeslips, rate, onRemove
) => {
  const items = Object.values(timeslips).sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  }).filter(t => t.hours > 0);

  return timeslips.map(timeslip => ({
    id: timeslip.id,
    title: moment(timeslip.date).format('MMM. DD, YYYY'),
    subTitle: `${timeslip.hours} hours ${timeslip.task}`,
    unitPrice: rate,
    subTotal: timeslip.hours * rate,
    onRemove: onRemove,
  }));
};
