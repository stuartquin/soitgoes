'use strict';
import React from 'react';
import moment from 'moment';

import { InvoiceActions } from './invoiceactions';
import { InvoiceSummary } from './invoicesummary';

import styles from './styles.css';

const API_URL = '/api/';

export const getUninvoicedAmount = (project) => {
  return project.get('uninvoiced_hours') * project.get('hourly_rate');
};

const InvoiceInfo = (props) => {
  const project = props.project;
  const invoice = props.invoice;

  let issued;
  let downloadBtn;
  if (props.isIssued) {
    const link = `${API_URL}invoices/${invoice.get('id')}/pdf`;
    const invoiceIssued = `text-muted ${styles.invoiceInfoIssued}`;
    issued = (
      <h6 className={ invoiceIssued }>
        { moment(invoice.get('issued_at')).format('YYYY-MM-DD HH:mm') }
      </h6>
    );
    downloadBtn = (
      <a target='_blank'
        className='pull-right btn btn-sm btn-default'
        href={link}>
        <span className='glyphicon glyphicon-download-alt'></span> PDF
      </a>
    );
  } else {
    issued = <h6 className='text-muted'>Not issued yet</h6>;
  }

  return (
    <div className='card'>
      <div className='card-block'>
        <h4>Invoice #{ invoice.get('sequence_num') } {downloadBtn} </h4>
        { issued }
      </div>

      <div className='card-block'>
        <h4>{ project.get('name') }</h4>
        <h6 className='text-muted'>{ project.get('contact').get('name') }</h6>
      </div>

      <hr />

      <InvoiceSummary
        project={project}
        invoice={invoice}
        timeslips={props.timeslips}
        invoiceItems={props.invoiceItems}
        total={props.total}
      />

      <hr />

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