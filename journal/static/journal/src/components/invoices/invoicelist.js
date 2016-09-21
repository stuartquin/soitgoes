import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import styles from './styles.css';

const InvoiceList = (props) => {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Invoice</th>
          <th>Issued</th>
          <th>Due</th>
          <th>Paid</th>
        </tr>
      </thead>
      <tbody>
      {props.invoices.map(invoice => (
        <tr>
          <td>
            <Link to={`/invoices/${invoice.id}`}>
            {invoice.project.name} #{invoice.sequence_num}
            </Link>
          </td>
          <td>{invoice.issued_at ? moment(invoice.issued_at).format('YYYY-MM-DD') : '-'}</td>
          <td>&pound;{invoice.total_due}</td>
          <td>&pound;{invoice.total_paid}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export {InvoiceList};
