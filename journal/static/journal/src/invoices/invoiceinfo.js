'use strict';
import React from 'react';
import moment from 'moment';

import { InvoiceActions } from './invoiceactions';
import { InvoiceSummary } from './invoicesummary';

import styles from './styles.css';

export const getUninvoicedAmount = (project) => {
  return project.get('uninvoiced_hours') * project.get('hourly_rate');
};

const InvoiceInfo = (props) => {
  const project = props.project;
  const invoice = props.invoice;

  let issued = 'Not issued yet';
  if (invoice.get('issued_at')) {
    issued = moment(invoice.get('issued_at')).format('YYYY-MM-DD HH:mm');
  }

  return (
    <div className='card'>
      <div className='card-block'>
        <h4 className="card-title">Project</h4>
        <span className="card-subtitle text-muted">
          { project.get('name') }
        </span>
      </div>
      <div className='card-block'>
        <h4 className="card-title">Contact</h4>
        <span className="card-subtitle text-muted">
        { project.get('contact').get('name') }
        </span>
      </div>
      <div className='card-block'>
        <h4 className="card-title">Created</h4>
        <span className="card-subtitle text-muted">
        { moment(invoice.get('created_at')).format('YYYY-MM-DD') }
        </span>
      </div>
      <div className='card-block'>
        <h4 className="card-title">Issued</h4>
        <span className="card-subtitle text-muted">
        { issued }
        </span>
      </div>
      <InvoiceSummary
        project={project}
        timeslipTotal={props.timeslipTotal}
        additionalTotal={props.additionalTotal}
      />
      <InvoiceActions
        invoice={ invoice }
        onMarkAsIssued={props.onMarkAsIssued}
        onDelete={props.onDelete}
      />
    </div>
  );
};

export {InvoiceInfo};
