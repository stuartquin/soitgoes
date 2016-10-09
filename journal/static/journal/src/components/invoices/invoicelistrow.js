import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import styles from './styles.css';

const InvoiceListRow = (props) => {
  const invoice = props.invoice;
  const issuedAt = invoice.issued_at ? moment(invoice.issued_at).format('YYYY-MM-DD') : '-';

  let totalClass = 'text-danger';
  let total = invoice.total_due;
  if (invoice.total_paid) {
    totalClass = 'text-success';
    total = invoice.total_paid;
  }

  return (
    <tr className={ styles.invoiceListRow }>
      <td>
        <Link to={`/invoices/${invoice.id}`}>
        {props.project.get('name')} #{invoice.sequence_num}
        </Link>
      </td>
      <td>
        {issuedAt}
      </td>
      <td>
        <span className={ totalClass }>&pound;{total}</span>
      </td>
    </tr>
  );
};

export {InvoiceListRow};
