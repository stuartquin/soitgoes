import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {TableRow, TableRowColumn} from 'material-ui/Table';


const InvoiceStateChip = (props) => {
  const invoice = props.invoice;
  const issued = invoice.get('issued_at');
  const today = moment();

  let text = '';
  let classNames = [
    'state-label'
  ];

  if (!issued) {
    classNames.push('state-label-default');
    text = 'Draft';
  } else {
    if (invoice.get('paid_at')) {
      classNames.push('state-label-success');
      text = moment(invoice.get('paid_at')).format('YYYY-MM-DD');
    } else {
      const dueDate = moment(invoice.get('due_date'));
      if (dueDate.isBefore(today)) {
        classNames.push('state-label-error');
        text = dueDate.fromNow(true)
      } else {
        classNames.push('state-label-warn');
        text = dueDate.toNow(true)
      }
    }
  }

  return (
    <span className={classNames.join(' ')}>
      <span className='state-label-icon'>
      </span>
      <span className='state-label-text'>
        {text}
      </span>
    </span>
  );
};

const InvoiceListRow = (props) => {
  const invoice = props.invoice;
  const issuedAt = invoice.get('issued_at') ? moment(invoice.get('issued_at')).format('YYYY-MM-DD') : '-';

  let totalClass = 'text-danger';
  let total = invoice.get('total_due');
  if (invoice.get('total_paid')) {
    totalClass = 'text-success';
    total = invoice.get('total_paid');
  }

  return (
    <TableRow className='invoice-list-row'>
      <TableRowColumn>
        <Link to={`/invoices/${invoice.get('id')}`}>
          #{invoice.get('sequence_num')} {props.project.get('name')}
        </Link>
      </TableRowColumn>
      <TableRowColumn className='invoice-column-total'>
        <span className={ totalClass }>&pound;{total}</span>
      </TableRowColumn>
      <TableRowColumn>
        <InvoiceStateChip
          invoice={invoice}
        />
      </TableRowColumn>
    </TableRow>
  );
};

export {InvoiceListRow};
