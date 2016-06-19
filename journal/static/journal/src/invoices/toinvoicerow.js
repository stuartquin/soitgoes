'use strict';
import React from 'react';

import styles from './styles.css';

const getUninvoicedAmount = (project) => {
  return project.get('uninvoiced_hours') * project.get('hourly_rate');
};

const ToInvoiceRow = (props) => {
  const project = props.project;
  return (
    <tr className={ styles.toInvoiceRow }>
      <td>{project.get('name')}</td>
      <td>{getUninvoicedAmount(project)}</td>
      <td>
        <button className='btn btn-default'>Create Invoice</button>
      </td>
    </tr>
  );
};

export {ToInvoiceRow};
