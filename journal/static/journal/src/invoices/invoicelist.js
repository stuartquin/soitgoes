import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import styles from './styles.css';

const getProjectName = (projects, id) => {
  const project = projects.find(p => p.get('id') === id);
  if (project) {
    return project.get('name');
  }
};

const InvoiceList = (props) => {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>#</th>
          <th>Project</th>
          <th>Issued</th>
          <th>Paid</th>
        </tr>
      </thead>
      <tbody>
      {props.invoices.map(invoice => (
        <tr>
          <td>#{invoice.sequence_num}</td>
          <td>
            <Link to={`/invoices/${invoice.id}`}>
              {getProjectName(props.projects, invoice.project)}
            </Link>
          </td>
          <td>{invoice.issued_at ? moment(invoice.issued_at).format('YYYY-MM-DD') : '-'}</td>
          <td>&pound;{invoice.total_paid}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export {InvoiceList};
