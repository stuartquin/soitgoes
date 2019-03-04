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
