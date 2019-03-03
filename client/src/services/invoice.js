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
    return 'Draft';
  }

  if (invoice.paid_at) {
    return 'Paid';
  }

  const now = moment();
  if (moment(invoice.due_date).isBefore(now)) {
    return 'Pending';
  }

  if (moment(invoice.due_date).isAfter(now)) {
    return 'Overdue';
  }

  return 'Unknown';
};


export const createNewInvoice = () => {

};
