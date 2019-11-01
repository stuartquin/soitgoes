import moment from 'moment';
import * as api from 'services/api';

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

  return null;
};

export const getInvoiceDueMessage = (invoice) => {
  if (!invoice.issued_at) {
    return '--';
  }

  if (invoice.paid_at) {
    return moment(invoice.paid_at).format('YYYY-MM-DD');
  }

  return invoice.due_date;
};

export const groupByTimeslip = (timeslips) => {
  const items = timeslips.sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  }).filter(t => t.hours > 0);

  return timeslips.map(timeslip => ({
    id: timeslip.id,
    title: moment(timeslip.date).format('MMM. DD, YYYY'),
    subTitle: `${timeslip.hours} hours`,
    unitPrice: timeslip.hourly_rate,
    subTotal: timeslip.hours * timeslip.hourly_rate,
    itemType: 'timeslips',
    hours: timeslip.hours,
    isActive: timeslip.isActive,
  }));
};

export const groupByTask = (
  tasks, rate, showHours,
) => {
  const items = tasks.filter(t => t.billing_type === 'TIME').sort((a, b) => {
    return a.completed_at > b.completed_at ? 1 : -1;
  });

  return items.map((task) => {
    const filteredTimeslips = task.timeslips.filter(
      timeslip => timeslip.isActive && timeslip.hours
    );
    const [subTotal, hours] = filteredTimeslips.reduce(([t, h], timeslip) => (
      [t + (timeslip.hourly_rate * timeslip.hours), h + timeslip.hours]
    ), [0, 0]);

    return {
      title: task.name,
      subTitle: showHours ? `${hours} hours` : null,
      unitPrice: subTotal,
      id: task.id,
      subItems: groupByTimeslip(filteredTimeslips),
      itemType: 'tasks',
      isActive: task.isActive,
      subTotal,
      hours,
    };
  }).filter(task => task.subTotal > 0);
};

export const getFixedTasks = (
  displayTasks
) => {
  return displayTasks.filter(
    task => task.billing_type === 'FIXED'
  ).map(task => ({
    title: task.name,
    subTitle: null,
    unitPrice: task.cost,
    subTotal: task.cost,
    id: task.id,
    itemType: 'tasks',
    isActive: task.isActive,
  }));
};


export const getDisplayItems = (
  invoice, rate, tasks = [],
) => {

  const taskIds = invoice.tasks || [];
  const timeslipIds = invoice.timeslips || [];
  const displayTimeslips = tasks.reduce((all, task) => (
    task.billing_type === 'TIME' ?
      all.concat(task.timeslips) :
      all
  ), []);

  const items =  invoice.group_by === 'tasks' ?
    groupByTask(tasks, invoice.show_hours) :
    groupByTimeslip(displayTimeslips);

  return items.concat(getFixedTasks(tasks));
};


export const getNewInvoice = (project) => {
  return {
    project,
    due_date: moment().add(14, 'days').format('YYYY-MM-DD'),
    timeslips: [],
    tasks: [],
    modifiers: [],
  };
};

export const fetchInvoices = (params = {}) => api.get('invoices/', params);
export const fetchUpcoming = () => api.get('invoices/upcoming/');
