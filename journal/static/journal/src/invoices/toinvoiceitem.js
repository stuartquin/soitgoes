'use strict';
import React from 'react';

import styles from './styles.css';

export const getUninvoicedAmount = (project) => {
  return project.get('uninvoiced_hours') * project.get('hourly_rate');
};


const ToInvoiceItem = (props) => {
  const project = props.project;
  const invoiceAmount = getUninvoicedAmount(project);
  const invoiceItemStyle = `col-md-3 ${styles.toInvoiceItem}`;


  return (
    <div className={ invoiceItemStyle }>
      <h4 className={ styles.toInvoiceItemProject }>{project.get('name')}</h4>
      <div className={ styles.toInvoiceItemRow }>&pound;{invoiceAmount}</div>
      <div className={ styles.toInvoiceItemRow }>&pound;0</div>
      <div className={ styles.toInvoiceItemRow }>
        <button className='btn-sm btn btn-success'
          onClick={() => props.onCreateInvoice(project)}
          disabled={invoiceAmount === 0}>
          Create Invoice
        </button>
      </div>
    </div>
  );
};

export {ToInvoiceItem};
