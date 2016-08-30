'use strict';
import React from 'react';
import moment from 'moment';

import { InvoiceActions } from './invoiceactions';
import { InvoiceSummary } from './invoicesummary';

import styles from './styles.css';

const API_URL = 'http://localhost:8000/api/';

export const getUninvoicedAmount = (project) => {
  return project.get('uninvoiced_hours') * project.get('hourly_rate');
};

const InvoiceInfo = (props) => {
  const project = props.project;
  const invoice = props.invoice;

  let issued = 'Not issued yet';
  if (props.isIssued) {
    const link = `${API_URL}invoices/${invoice.get('id')}/pdf`;
    const invoiceIssued = `text-muted ${styles.invoiceInfoIssued}`;
    issued = (
      <h6 className={ invoiceIssued }>
        { moment(invoice.get('issued_at')).format('YYYY-MM-DD HH:mm') }
        <a target='_blank'
          className='card-link pull-right'
          href={link}>Download PDF</a>
      </h6>
    );
  } else {
    issued = <h6 className='text-muted'>Not issued yet</h6>;
  }

  return (
    <div className='card'>
      <div className='card-block'>
        <h4>Invoice #{ invoice.get('sequence_num') }</h4>
        { issued }
      </div>

      <div className='card-block'>
        <h4>{ project.get('name') }</h4>
        <h6 className='text-muted'>{ project.get('contact').get('name') }</h6>
      </div>

      <InvoiceSummary
        project={project}
        invoice={invoice}
        timeslipTotal={props.timeslipTotal}
        additionalTotal={props.additionalTotal}
        total={props.total}
      />

      <InvoiceActions
        invoice={ invoice }
        onMarkAsIssued={props.onMarkAsIssued}
        onMarkAsPaid={props.onMarkAsPaid}
        onDelete={props.onDelete}
      />
    </div>
  );
};

export {InvoiceInfo};
