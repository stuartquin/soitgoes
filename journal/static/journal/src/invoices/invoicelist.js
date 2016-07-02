import React from 'react';
import { Link } from 'react-router';

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
      <tbody>
      {props.invoices.map(invoice => (
        <tr>
          <td>#{invoice.sequence_num}</td>
          <td>
            <Link to={`/invoices/${invoice.id}`}>{getProjectName(props.projects, invoice.project)}</Link>
          </td>
          <td>{invoice.created_at}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export {InvoiceList};
